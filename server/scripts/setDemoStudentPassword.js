/**
 * ScholarBridge Demo Student Password Setup Tool
 * Securely updates Aarav's demo password hash from DEMO_STUDENT_PASSWORD env var.
 * No hardcoded password fallbacks. Never logs password or hash.
 */

import bcrypt from 'bcryptjs';
import { query, getPool } from '../db/index.js';
import { validateConfig } from '../config.js';

async function setDemoStudentPassword() {
  const pool = getPool();
  try {
    const validation = validateConfig();
    if (!validation.valid) {
      throw new Error(`Configuration Error: ${validation.issues.join('; ')}`);
    }

    const password = process.env.DEMO_STUDENT_PASSWORD;
    if (!password) {
      throw new Error('DEMO_STUDENT_PASSWORD environment variable is required. Halting without updating.');
    }

    if (password.length < 8) {
      throw new Error('DEMO_STUDENT_PASSWORD must be at least 8 characters long.');
    }

    const email = 'aarav.mehta@university.edu.sample';
    const hash = await bcrypt.hash(password, 10);

    const res = await query(
      `UPDATE users 
       SET password_hash = $1, updated_at = NOW() 
       WHERE email = $2 
       RETURNING id, email, role, updated_at;`,
      [hash, email]
    );

    if (res.rows.length === 0) {
      throw new Error(`Account '${email}' not found.`);
    }

    // Secret-safe log: Only prints email and id, never password or hash
    console.log(`[Success] Updated password hash for ${res.rows[0].email} (ID: ${res.rows[0].id})`);
  } finally {
    await pool.end();
  }
}

setDemoStudentPassword().catch((err) => {
  console.error('[Demo Student Password Error]', err.message);
  process.exit(1);
});
