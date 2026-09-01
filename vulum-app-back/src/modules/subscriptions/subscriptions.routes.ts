/**
 * Subscriptions Routes
 *
 * Preserves V1 API contract exactly.
 * V1 route prefix: /user-subscription
 *
 *   GET    /user-subscription                 (authenticated) — paginated list
 *   GET    /user-subscription/my-subscription  (authenticated) — user's subscription
 *   GET    /user-subscription/:id              (authenticated) — single subscription
 *   POST   /user-subscription                  (authenticated) — create (returns 201)
 *   DELETE /user-subscription/:id              (authenticated) — delete (returns 204)
 *
 * V1 Controller: src/api/controllers/Subscriptions/UserSubscriptionController.ts
 * - All endpoints require authentication (class-level AuthCheck)
 * - No role gates on any endpoint
 * - PUT is COMMENTED OUT in V1 — no update endpoint
 *
 * Static routes (my-subscription) registered before parameterized (:id)
 * so Express does not interpret them as IDs.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../shared/middleware/authenticate';
import { NotFoundError } from '../../shared/errors';
import * as subscriptionsService from './subscriptions.service';

const router = Router();

// GET /user-subscription
// Paginated list of all subscriptions
router.get(
  '/user-subscription',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const result = await subscriptionsService.getAll(page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// GET /user-subscription/my-subscription
// Get current user's subscription (returns { plan_id })
router.get(
  '/user-subscription/my-subscription',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await subscriptionsService.getMySubscription(req.user!.userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// GET /user-subscription/:id
// Single subscription by ID
router.get(
  '/user-subscription/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (!id || isNaN(id)) {
        throw new NotFoundError('Subscription', req.params.id);
      }
      const result = await subscriptionsService.findOneById(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// POST /user-subscription
// Create a new subscription
// Returns 201
router.post(
  '/user-subscription',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await subscriptionsService.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /user-subscription/:id
// Delete a subscription
// Returns 204 (no content)
router.delete(
  '/user-subscription/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (!id || isNaN(id)) {
        throw new NotFoundError('Subscription', req.params.id);
      }
      await subscriptionsService.deleteOneById(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
