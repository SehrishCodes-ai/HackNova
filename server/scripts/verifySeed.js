/**
 * Read-only Seed Verification Script
 */
import { query, getPool } from '../db/index.js';

async function verifySeed() {
  const usersRes = await query("SELECT COUNT(*)::int AS count FROM users WHERE id LIKE 'usr-demo-%';");
  const oppsRes = await query("SELECT COUNT(*)::int AS count FROM opportunities WHERE is_demonstration_sample = TRUE;");
  const attendanceRes = await query("SELECT COUNT(*)::int AS count FROM student_attendance_history;");
  const appsRes = await query("SELECT COUNT(*)::int AS count FROM applications;");
  const savedRes = await query("SELECT COUNT(*)::int AS count FROM saved_opportunities;");
  const allocationsRes = await query("SELECT COUNT(*)::int AS count FROM opportunity_seat_allocations;");
  const migrationsRes = await query("SELECT version, applied_at FROM schema_migrations ORDER BY applied_at;");

  console.log('--- DEMONSTRATION SEED VERIFICATION ---');
  console.log('Demo Users Count:', usersRes.rows[0].count);
  console.log('Demo Opportunities Count:', oppsRes.rows[0].count);
  console.log('Attendance History Records Count:', attendanceRes.rows[0].count);
  console.log('Applications Count:', appsRes.rows[0].count);
  console.log('Saved Opportunities Count:', savedRes.rows[0].count);
  console.log('Confirmed Seat Allocations Count:', allocationsRes.rows[0].count);
  console.log('--- REGISTERED MIGRATIONS ---');
  migrationsRes.rows.forEach(m => console.log(`- ${m.version} (at ${m.applied_at})`));

  const pool = getPool();
  await pool.end();
}

verifySeed().catch((err) => {
  console.error('Seed verification failed:', err.message);
  process.exit(1);
});
