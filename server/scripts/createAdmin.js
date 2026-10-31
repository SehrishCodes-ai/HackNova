/**
 * ScholarBridge Restricted Administrator Account Provisioning Tool
 * Allows safe creation of administrator accounts by system owners.
 * Public registration cannot create admin accounts.
 * Passwords are salted and hashed with bcrypt (12 rounds) and never logged.
 * 
 * Usage:
 *   ADMIN_EMAIL="admin@yourdomain.com" ADMIN_PASSWORD="your-strong-password" node server/scripts/createAdmin.js
 */

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from '../db/index.js';
import { validateConfig } from '../config.js';

const __filename = fileURLToPath(import.meta.url);

export async function createAdmin(email, password) {
  const validation = validateConfig();
  if (!validation.valid) {
    throw new Error(`Configuration Error: ${validation.issues.join('; ')}`);
  }

  const normalizedEmail = email ? email.toLowerCase().trim() : '';

  // 1. Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
    throw new Error('A valid administrator email address is required.');
  }

  // 2. Validate password strength
  if (!password || password.length < 10) {
    throw new Error('Administrator password must be at least 10 characters long.');
  }

  // 3. Prevent accidental overwrite of existing accounts
  const existing = await query('SELECT id, email, role FROM users WHERE email = $1', [normalizedEmail]);
  if (existing.rows.length > 0) {
    throw new Error(`An account with email '${normalizedEmail}' already exists with role '${existing.rows[0].role}'. Existing accounts cannot be overwritten.`);
  }

  // 4. Hash password with bcrypt (12 salt rounds)
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const adminId = `usr-admin-${crypto.randomBytes(6).toString('hex')}`;

  // 5. Insert admin user
  const res = await query(
    `INSERT INTO users (id, email, password_hash, role)
     VALUES ($1, $2, $3, 'admin')
     RETURNING id, email, role, created_at;`,
    [adminId, normalizedEmail, passwordHash]
  );

  return res.rows[0];
}

// Windows path-safe CLI entry check
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  const email = process.env.ADMIN_EMAIL || process.argv[2];
  const password = process.env.ADMIN_PASSWORD || process.argv[3];

  if (!email || !password) {
    console.error('Usage: Provide ADMIN_EMAIL and ADMIN_PASSWORD environment variables.');
    process.exit(1);
  }

  createAdmin(email, password)
    .then((user) => {
      // Secret-safe logging: Only prints email, role, and ID; never password
      console.log(`[Admin Provisioning] Successfully provisioned administrator: ${user.email} (ID: ${user.id})`);
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Admin Provisioning Failed]', err.message);
      process.exit(1);
    });
}
