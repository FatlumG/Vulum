/**
 * Role-Based Authorization Middleware
 *
 * Must be used AFTER authenticate middleware.
 * Checks if the authenticated user has the required role.
 *
 * Usage:
 *   router.get('/admin', authenticate, requireRole('admin'), handler);
 *   router.get('/manager', authenticate, requireRole('admin', 'manager'), handler);
 */

import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../errors';

/**
 * Middleware factory that checks if user has one of the required roles.
 *
 * @param roles - One or more role names that are allowed
 * @returns Express middleware
 *
 * @example
 *   // Only admins can access
 *   router.delete('/users/:id', authenticate, requireRole('admin'), handler);
 *
 *   // Admins and managers can access
 *   router.put('/products/:id', authenticate, requireRole('admin', 'manager'), handler);
 */
export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ForbiddenError('Authentication required'));
    }

    const userRole = req.user.role;

    if (!userRole) {
      return next(new ForbiddenError('No role assigned'));
    }

    // Case-insensitive role comparison
    const hasRole = roles.some(
      (role) => role.toLowerCase() === userRole.toLowerCase()
    );

    if (!hasRole) {
      return next(
        new ForbiddenError(
          `Required role: ${roles.join(' or ')}. Your role: ${userRole}`
        )
      );
    }

    next();
  };
}

/**
 * Check if the current user owns a resource.
 *
 * Usage:
 *   router.put('/products/:id', authenticate, requireOwnership('userId'), handler);
 *
 * @param userIdField - The field in req.user that contains the owner ID
 * @param paramName - The route param name that contains the resource owner ID (default: 'id')
 */
export function requireOwnership(userIdField: string = 'userId') {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ForbiddenError('Authentication required'));
    }

    const resourceOwnerId = parseInt(req.params.id, 10);
    const userId = (req.user as any)[userIdField];

    if (userId !== resourceOwnerId) {
      return next(new ForbiddenError('You can only access your own resources'));
    }

    next();
  };
}
