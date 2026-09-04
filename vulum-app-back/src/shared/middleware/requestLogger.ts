/**
 * Request Logger Middleware
 *
 * Logs incoming requests with timing information.
 * Structured format for easy parsing and monitoring.
 *
 * Usage:
 *   app.use(requestLogger);
 *   // Place early in middleware chain
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Colors for terminal output (development only)
 */
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

/**
 * Get color based on status code
 */
function getStatusColor(statusCode: number): string {
  if (statusCode >= 500) return colors.red;
  if (statusCode >= 400) return colors.yellow;
  if (statusCode >= 300) return colors.cyan;
  return colors.green;
}

/**
 * Format duration for display
 */
function formatDuration(ms: number): string {
  if (ms < 1) return '<1ms';
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Request logger middleware.
 *
 * Logs: METHOD /path STATUS DURATION
 * Example: GET /api/users 200 45ms
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  // Capture the original end method
  const originalEnd = res.end;

  // Override end to log after response is sent
  res.end = function (this: Response, ...args: any[]) {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const method = req.method;
    const path = req.originalUrl || req.url;

    // Only log API routes, skip static files
    if (path.startsWith('/api')) {
      const statusColor = getStatusColor(statusCode);
      const durationStr = formatDuration(duration);

      if (process.env.NODE_ENV === 'development') {
        console.log(
          `${colors.dim}${new Date().toISOString()}${colors.reset} ` +
          `${method} ${path} ` +
          `${statusColor}${statusCode}${colors.reset} ` +
          `${colors.dim}${durationStr}${colors.reset}`
        );
      } else {
        // Production: structured JSON logging
        console.log(
          JSON.stringify({
            timestamp: new Date().toISOString(),
            method,
            path,
            status: statusCode,
            duration,
            ip: req.ip,
            userAgent: req.get('user-agent'),
          })
        );
      }
    }

    // Call original end
    return originalEnd.apply(this, args as any);
  } as any;

  next();
}

/**
 * Health check endpoint.
 *
 * Returns basic server health status.
 * Does NOT check database (that's a separate endpoint).
 */
export function healthCheck(_req: Request, res: Response) {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
}
