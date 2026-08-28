/**
 * JWT Authentication Middleware
 *
 * Extracts and verifies JWT token from Authorization header.
 * Attaches decoded user to req.user for downstream handlers.
 *
 * Usage:
 *   router.get('/protected', authenticate, handler);
 *   router.get('/protected', authenticate, requireRole('admin'), handler);
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors';

// ============================================================
// Types
// ============================================================

export interface AuthUser {
  userId: number;
  email: string;
  role: string;
  roleId: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

// ============================================================
// Configuration
// ============================================================

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// ============================================================
// Middleware
// ============================================================

/**
 * Authenticate request via JWT token.
 *
 * Reads token from: Authorization: Bearer <token>
 * Attaches decoded payload to: req.user
 *
 * Throws UnauthorizedError if:
 * - No token provided
 * - Token is malformed
 * - Token is expired
 * - Token signature is invalid
 */
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError('Token expired'));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid token'));
    } else {
      next(error);
    }
  }
}

/**
 * Optional authentication.
 *
 * Same as authenticate but does NOT throw if no token is present.
 * Useful for routes that behave differently for authenticated vs anonymous users.
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    req.user = decoded;
    next();
  } catch {
    // Ignore auth errors for optional auth
    next();
  }
}

// ============================================================
// Token Generation
// ============================================================

/**
 * Generate JWT token for a user.
 *
 * Usage:
 *   const token = generateToken({ userId: 1, email: 'user@example.com', role: 'user', roleId: 1 });
 */
export function generateToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Decode token without verification (for debugging only).
 */
export function decodeToken(token: string): AuthUser | null {
  try {
    return jwt.decode(token) as AuthUser;
  } catch {
    return null;
  }
}
