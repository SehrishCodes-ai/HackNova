import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { query, getClient } from '../db/index.js';
import { config } from '../config.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Simple in-memory sliding-window rate limiter for brute-force protection
const loginAttempts = new Map();

function checkLoginRateLimit(ip) {
  const now = Date.now();
  const entry = loginAttempts.get(ip) || { count: 0, firstAttempt: now };

  if (now - entry.firstAttempt > config.rateLimitWindowMs) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return true;
  }

  if (entry.count >= config.rateLimitMaxAttempts) {
    return false;
  }

  entry.count += 1;
  loginAttempts.set(ip, entry);
  return true;
}

function resetLoginRateLimit(ip) {
  loginAttempts.delete(ip);
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  if (!checkLoginRateLimit(ip)) {
    return res.status(429).json({
      error: 'Too many failed login attempts. Please try again in 15 minutes.',
    });
  }

  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const userResult = await query(
      'SELECT id, email, password_hash, role FROM users WHERE email = $1',
      [normalizedEmail]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = userResult.rows[0];

    // Check role expectation if specified by client
    if (role && user.role !== role) {
      return res.status(401).json({
        error: `Account is registered as ${user.role}. Please sign in through the ${user.role === 'admin' ? 'Administrator' : 'Student'} portal.`,
      });
    }

    // Check if account password hash is disabled
    if (user.password_hash.startsWith('!DISABLED')) {
      return res.status(401).json({
        error: 'This account is a demonstration audit anchor and cannot log in.',
      });
    }

    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    resetLoginRateLimit(ip);

    // Fetch profile if user is student
    let profile = null;
    if (user.role === 'student') {
      const profRes = await query('SELECT * FROM student_profiles WHERE user_id = $1', [user.id]);
      if (profRes.rows.length > 0) {
        profile = profRes.rows[0];
      }
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    return res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
      profile,
    });
  } catch (err) {
    console.error('[Login Error]', err.message);
    return res.status(500).json({ error: 'Authentication service temporarily unavailable' });
  }
});

// POST /api/auth/register (STUDENTS ONLY)
router.post('/register', async (req, res) => {
  const { email, password, fullName, institution, educationLevel, fieldOfStudy, currentYear } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ error: 'Full name, email, and password are required' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    return res.status(400).json({ error: 'Valid email address is required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  const client = await getClient();
  try {
    await client.query('BEGIN');

    // Check existing
    const existing = await client.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existing.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'An account with this email address already exists' });
    }

    const userId = `usr-std-${crypto.randomBytes(6).toString('hex')}`;
    const passwordHash = await bcrypt.hash(password, 10);

    // Security Rule: Public registration is strictly locked to role = 'student'
    await client.query(
      'INSERT INTO users (id, email, password_hash, role) VALUES ($1, $2, $3, $4)',
      [userId, normalizedEmail, passwordHash, 'student']
    );

    await client.query(
      `INSERT INTO student_profiles (
        user_id, full_name, institution, education_level, field_of_study, current_year
      ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        userId,
        fullName.trim(),
        institution ? institution.trim() : 'Unspecified Institution',
        educationLevel || 'Undergraduate',
        fieldOfStudy ? fieldOfStudy.trim() : 'General Studies',
        currentYear ? currentYear.trim() : '1st Year',
      ]
    );

    await client.query('COMMIT');

    const token = jwt.sign(
      { userId, email: normalizedEmail, role: 'student' },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    const profRes = await query('SELECT * FROM student_profiles WHERE user_id = $1', [userId]);

    return res.status(201).json({
      token,
      user: { id: userId, email: normalizedEmail, role: 'student' },
      profile: profRes.rows[0],
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[Register Error]', err.message);
    return res.status(500).json({ error: 'Registration service error' });
  } finally {
    client.release();
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userRes = await query('SELECT id, email, role, created_at FROM users WHERE id = $1', [req.user.userId]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userRes.rows[0];
    let profile = null;
    if (user.role === 'student') {
      const profRes = await query('SELECT * FROM student_profiles WHERE user_id = $1', [user.id]);
      if (profRes.rows.length > 0) {
        profile = profRes.rows[0];
      }
    }

    return res.json({ user, profile });
  } catch (err) {
    console.error('[Auth Me Error]', err.message);
    return res.status(500).json({ error: 'Failed to retrieve profile' });
  }
});

export default router;
