/**
 * Read-only Table Verification Script
 */
import { query, getPool } from '../db/index.js';

async function verify() {
  const res = await query(
    `SELECT table_name 
     FROM information_schema.tables 
     WHERE table_schema = 'public' 
     ORDER BY table_name;`
  );

  console.log(`--- VERIFIED PUBLIC TABLES (${res.rows.length}) ---`);
  res.rows.forEach((r, idx) => {
    console.log(`${idx + 1}. ${r.table_name}`);
  });

  const migRes = await query('SELECT version, applied_at FROM schema_migrations ORDER BY applied_at;');
  console.log(`--- APPLIED MIGRATIONS (${migRes.rows.length}) ---`);
  migRes.rows.forEach((m) => {
    console.log(`Version: ${m.version} | Applied: ${m.applied_at}`);
  });

  const pool = getPool();
  await pool.end();
}

verify().catch((err) => {
  console.error('Verification failed:', err.message);
  process.exit(1);
});
