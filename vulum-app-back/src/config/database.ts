/**
 * V2 Database Configuration
 *
 * PostgreSQL connection settings for Drizzle ORM.
 * Uses DATABASE_URL for connection string.
 *
 * Environment variables:
 * - DATABASE_URL: PostgreSQL connection string (required)
 *   Format: postgresql://user:password@host:port/database
 *
 * - DB_POOL_MAX: Maximum pool connections (default: 20)
 * - DB_POOL_IDLE_TIMEOUT: Idle timeout in ms (default: 30000)
 * - DB_POOL_CONNECT_TIMEOUT: Connect timeout in ms (default: 5000)
 */

function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getEnvOptional(key: string, defaultValue?: string): string | undefined {
  return process.env[key] || defaultValue;
}

export const databaseConfig = {
  /**
   * PostgreSQL connection string
   * Format: postgresql://user:password@host:port/database
   */
  url: getEnv('DATABASE_URL', 'postgresql://vulum:vulum_dev@localhost:5432/vulum_dev'),

  /**
   * Connection pool settings
   */
  pool: {
    max: parseInt(getEnvOptional('DB_POOL_MAX', '20') || '20', 10),
    idleTimeoutMillis: parseInt(getEnvOptional('DB_POOL_IDLE_TIMEOUT', '30000') || '30000', 10),
    connectionTimeoutMillis: parseInt(getEnvOptional('DB_POOL_CONNECT_TIMEOUT', '5000') || '5000', 10),
  },

  /**
   * Drizzle Kit configuration paths
   */
  paths: {
    schema: './src/db/schema/*',
    migrations: './src/db/migrations',
  },
} as const;

export type DatabaseConfig = typeof databaseConfig;
