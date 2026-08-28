/**
 * Database Migration Runner
 *
 * Runs Drizzle migrations against the database.
 *
 * Usage:
 *   npx ts-node src/db/migrate.ts
 *   or
 *   npm run db:migrate:v2
 */

import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, pool } from './client';

async function runMigrations() {
  console.log('🔄 Running database migrations...\n');

  try {
    await migrate(db, { migrationsFolder: './src/db/migrations' });

    console.log('✅ Migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
  });
