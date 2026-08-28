/**
 * Health Check Routes
 *
 * Provides endpoints for monitoring application health.
 * Useful for load balancers, Docker healthchecks, and monitoring.
 *
 * Endpoints:
 * - GET /api/health — Basic server health (no DB check)
 * - GET /api/health/db — Database connectivity check
 */

import { Router, Request, Response } from 'express';
import { db } from '../db/client';
import { sql } from 'drizzle-orm';

const router = Router();

/**
 * Basic health check — no external dependencies
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * Database health check — verifies PostgreSQL connectivity
 */
router.get('/health/db', async (_req: Request, res: Response) => {
  try {
    // Simple query to verify database connection
    const result = await db.execute(sql`SELECT 1 AS health`);

    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      error: message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Readiness check — verifies all dependencies are ready
 */
router.get('/health/ready', async (_req: Request, res: Response) => {
  const checks = {
    server: true,
    database: false,
  };

  try {
    await db.execute(sql`SELECT 1`);
    checks.database = true;
  } catch {
    checks.database = false;
  }

  const allReady = Object.values(checks).every(Boolean);

  res.status(allReady ? 200 : 503).json({
    status: allReady ? 'ready' : 'not_ready',
    checks,
    timestamp: new Date().toISOString(),
  });
});

export default router;
