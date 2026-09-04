/**
 * Users Routes
 *
 * Preserves V1 API contract exactly.
 * Frontend calls these endpoints:
 *   GET  /api/users/dashboard-stats    (authenticated)
 *   GET  /api/users/get-monthly-stats  (authenticated)
 *   GET  /api/users/profile            (authenticated)
 *   GET  /api/users/:username          (public)
 *   GET  /api/users/me                 (authenticated)
 *   PATCH /api/users/:id               (authenticated, owner only)
 *   PUT  /api/users/update-my-profile-picture (authenticated)
 */

import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../shared/middleware/authenticate';
import { validate } from '../../shared/validation';
import { userSchemas } from '../../shared/validation';
import * as usersService from './users.service';

const router = Router();

// ============================================================
// GET /users/dashboard-stats
// Returns computed counters (V1 used denormalized columns)
// ============================================================
router.get(
  '/users/dashboard-stats',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await usersService.dashboardStats(req.user!.userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================
// GET /users/get-monthly-stats
// Returns monthly aggregates for the current year
// ============================================================
router.get(
  '/users/get-monthly-stats',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();
      const result = await usersService.getMonthlyStats(req.user!.userId, year);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================
// GET /users/profile
// Returns minimal profile for display
// ============================================================
router.get(
  '/users/profile',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await usersService.getProfile(req.user!.userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================
// GET /users/me
// Returns full user object for the authenticated user
// ============================================================
router.get(
  '/users/me',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await usersService.getUserById(req.user!.userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================
// GET /users/:username
// Returns user by username (used for search/lookup)
// ============================================================
router.get(
  '/users/:username',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await usersService.getUsersBySearch(req.params.username);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================
// PATCH /users/:id
// Update user profile fields
// ============================================================
router.patch(
  '/users/:id',
  authenticate,
  validate(userSchemas.update),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.id);

      // Ownership check: users can only update their own profile
      if (req.user!.userId !== userId) {
        return next(new (await import('../../shared/errors')).ForbiddenError(
          'You can only update your own profile'
        ));
      }

      const result = await usersService.updateUser(userId, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================
// PUT /users/update-my-profile-picture
// Update profile photo (Cloudinary integration deferred to Phase 4)
// ============================================================
router.put(
  '/users/update-my-profile-picture',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Placeholder — Cloudinary integration will be added in Phase 4
      res.status(501).json({ message: 'Profile picture upload not yet implemented in V2' });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
