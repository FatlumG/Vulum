/**
 * Middleware barrel export
 *
 * Central export point for all shared middleware.
 *
 * Usage:
 *   import { authenticate, requireRole, errorHandler } from '@/shared/middleware';
 */

export { authenticate, optionalAuth, generateToken, decodeToken } from './authenticate';
export type { AuthUser } from './authenticate';

export { requireRole, requireOwnership } from './requireRole';

export { errorHandler, notFoundHandler, asyncHandler } from './errorHandler';

export { requestLogger, healthCheck } from './requestLogger';
