import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

/**
 * PostgreSQL connection pool.
 *
 * Uses node-postgres (pg) Pool for connection management.
 * Environment variables:
 * - DATABASE_URL: PostgreSQL connection string
 *   Format: postgresql://user:password@host:port/database
 *
 * Pool configuration:
 * - max: 20 connections (sufficient for most applications)
 * - idleTimeoutMillis: 30s (release idle connections)
 * - connectionTimeoutMillis: 5s (fail fast if DB is down)
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

/**
 * Drizzle ORM client with full schema awareness.
 *
 * Usage:
 *   import { db } from '@/db/client';
 *   const users = await db.query.users.findMany();
 */
export const db = drizzle(pool, { schema });

/**
 * Raw pool for advanced use cases (migrations, transactions).
 * Prefer using `db` for all application queries.
 */
export { pool };
