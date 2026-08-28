/**
 * Global Error Handler Middleware
 *
 * Catches all unhandled errors and returns consistent JSON responses.
 * Does NOT expose stack traces or internal details in production.
 *
 * Usage:
 *   app.use(errorHandler);
 *   // Must be LAST middleware
 */

import { Request, Response, NextFunction } from 'express';
import { AppError, isOperationalError, toAppError } from '../errors';

/**
 * Global error handler.
 *
 * - Operational errors (AppError): Returns structured error response
 * - Unexpected errors: Returns generic 500, logs full error
 * - Always returns JSON
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Convert unknown errors to AppError
  const appError = toAppError(err);

  // Log unexpected errors (non-operational)
  if (!isOperationalError(err)) {
    console.error('❌ UNEXPECTED ERROR:', {
      message: err.message,
      stack: err.stack,
      name: err.name,
    });
  }

  // Build response
  const response = {
    error: {
      code: appError.code,
      message: appError.isOperational
        ? appError.message
        : 'Internal server error',
      ...(appError.details && { details: appError.details }),
      // Only include stack in development
      ...((process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging') && {
        stack: err.stack,
      }),
    },
  };

  res.status(appError.statusCode).json(response);
}

/**
 * 404 handler for undefined routes.
 *
 * Usage:
 *   app.use(notFoundHandler);
 *   // Place before errorHandler
 */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  const error = new AppError(
    `Route not found: ${req.method} ${req.originalUrl}`,
    404,
    'ROUTE_NOT_FOUND'
  );
  next(error);
}

/**
 * Async handler wrapper.
 *
 * Catches async errors and forwards to error handler.
 * Eliminates need for try-catch in every async route.
 *
 * Usage:
 *   router.get('/users/:id', asyncHandler(async (req, res) => {
 *     const user = await userService.findById(req.params.id);
 *     res.json(user);
 *   }));
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
