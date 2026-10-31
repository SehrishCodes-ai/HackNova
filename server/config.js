/**
 * ScholarBridge Backend Configuration Module
 * Loads environment variables and provides validated configuration.
 * Secrets are protected and never logged.
 */

import dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'scholarbridge_dev_secret_change_in_production_32char',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // Rate limiting configuration
  rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
  rateLimitMaxAttempts: 5, // max failed login attempts per window
};

export function validateConfig() {
  const issues = [];
  
  if (!config.databaseUrl) {
    issues.push('DATABASE_URL is not set. A PostgreSQL connection string is required.');
  }

  if (config.env === 'production' && config.jwtSecret.includes('dev_secret')) {
    issues.push('JWT_SECRET must be configured with a cryptographically strong secret in production.');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
