/**
 * ScholarBridge PostgreSQL Database Connection Pool
 * Provides robust connection management, query execution, and transaction utilities.
 * Credentials and secrets are never printed or logged.
 */

import pkg from 'pg';
const { Pool } = pkg;
import { config } from '../config.js';

let pool = null;

export function getPool() {
  if (!pool) {
    if (!config.databaseUrl) {
      throw new Error('DATABASE_URL is not configured. PostgreSQL connection requires a valid connection string.');
    }

    const isCloudPostgres = config.databaseUrl.includes('neon.tech') ||
      config.databaseUrl.includes('supabase.co') ||
      config.databaseUrl.includes('render.com') ||
      config.databaseUrl.includes('amazonaws.com') ||
      config.databaseUrl.includes('sslmode=require');

    pool = new Pool({
      connectionString: config.databaseUrl,
      ssl: isCloudPostgres ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    pool.on('error', (err) => {
      // Idle client encountered an error; log error code without secrets
      console.error('[DB Pool Error]', err.code || err.message);
    });
  }

  return pool;
}

/**
 * Execute parameterized query safely
 * @param {string} text - SQL query text with $1, $2 placeholders
 * @param {Array} params - Parameter values
 * @returns {Promise<pg.QueryResult>}
 */
export async function query(text, params = []) {
  const p = getPool();
  const start = Date.now();
  try {
    const res = await p.query(text, params);
    return res;
  } catch (error) {
    // Log error code and sanitized query start, never parameter values or credentials
    console.error(`[DB Query Error] ${error.code || 'UNKNOWN'}: ${error.message}`);
    throw error;
  }
}

/**
 * Acquire a dedicated client for multi-statement atomic transactions
 * @returns {Promise<pg.PoolClient>}
 */
export async function getClient() {
  const p = getPool();
  const client = await p.connect();
  return client;
}

/**
 * Test connectivity without exposing database URL
 * @returns {Promise<{ ok: boolean, message: string }>}
 */
export async function testConnection() {
  try {
    const res = await query('SELECT NOW() AS server_time, version() AS pg_version;');
    return {
      ok: true,
      message: 'PostgreSQL connection established successfully.',
      serverTime: res.rows[0].server_time,
    };
  } catch (err) {
    return {
      ok: false,
      message: err.message,
      code: err.code,
    };
  }
}
