/**
 * ScholarBridge Neon PostgreSQL Migration & Seeding Runner
 * Safely executes versioned DDL migrations and demonstration data seeding.
 * Prevents re-execution of already-applied migrations using schema_migrations.
 * Accidental production executions require explicit confirmation.
 * Credentials and database secrets are never exposed or logged.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getClient, testConnection } from './index.js';
import { config, validateConfig } from '../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigration(options = { seed: false, forceConfirm: false }) {
  // 1. Validate configuration
  const validation = validateConfig();
  if (!validation.valid) {
    throw new Error(`Configuration Error: ${validation.issues.join('; ')}`);
  }

  // 2. Production safety guard
  if (config.env === 'production' && !options.forceConfirm) {
    throw new Error('Production environment detected. Pass { forceConfirm: true } or --confirm CLI flag to proceed.');
  }

  console.log('[Migration] Testing PostgreSQL connectivity...');
  const testRes = await testConnection();
  if (!testRes.ok) {
    throw new Error(`Connection failed: ${testRes.message}`);
  }
  console.log('[Migration] Connected successfully. Target DB time:', testRes.serverTime);

  const client = await getClient();

  try {
    // 3. Ensure schema_migrations tracking table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(100) PRIMARY KEY,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Check if initial schema migration was already applied
    const initialCheck = await client.query(
      'SELECT version FROM schema_migrations WHERE version = $1',
      ['001_initial_schema']
    );

    if (initialCheck.rows.length === 0) {
      console.log('[Migration] Applying schema DDL (server/db/schema.sql)...');
      const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

      await client.query('BEGIN');
      await client.query(schemaSql);
      await client.query(
        'INSERT INTO schema_migrations (version) VALUES ($1)',
        ['001_initial_schema']
      );
      await client.query('COMMIT');
      console.log('[Migration] Schema DDL applied and registered as 001_initial_schema.');
    } else {
      console.log('[Migration] Version 001_initial_schema is already applied. Skipping.');
    }

    // 5. Apply demonstration seed data if requested
    if (options.seed) {
      const seedCheck = await client.query(
        'SELECT version FROM schema_migrations WHERE version = $1',
        ['002_demo_seed_v1']
      );

      if (seedCheck.rows.length === 0) {
        console.log('[Migration] Seeding demonstration records (server/db/seed.sql)...');
        const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');

        await client.query('BEGIN');
        await client.query(seedSql);
        await client.query(
          'INSERT INTO schema_migrations (version) VALUES ($1)',
          ['002_demo_seed_v1']
        );
        await client.query('COMMIT');
        console.log('[Migration] Demonstration data applied successfully and registered as 002_demo_seed_v1.');
      } else {
        console.log('[Migration] Demonstration seed 002_demo_seed_v1 is already applied. Skipping.');
      }
    }

    return { success: true };
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('[Migration Aborted & Rolled Back]', error.message);
    throw error;
  } finally {
    client.release();
  }
}

// Windows path-safe CLI entry check (prevents execution when imported as a module)
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  const shouldSeed = process.argv.includes('--seed');
  const forceConfirm = process.argv.includes('--confirm');
  runMigration({ seed: shouldSeed, forceConfirm })
    .then(() => {
      console.log('[Migration] Process finished cleanly.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Migration Fatal Error]', err.message);
      process.exit(1);
    });
}
