/**
 * Plans Routes
 *
 * Preserves V1 API contract exactly.
 * V1 route prefix: /pricing (NOT /plans)
 *
 *   GET    /pricing              (authenticated) — paginated list
 *   GET    /pricing/myPlan       (authenticated) — user's current plan
 *   GET    /pricing/:id          (authenticated) — single plan
 *   POST   /pricing              (authenticated) — create plan (returns 201)
 *   POST   /pricing/checkout-session (authenticated) — Stripe checkout (DEFERRED → 501)
 *   PUT    /pricing/:id          (authenticated) — update plan
 *   DELETE /pricing/:id          (authenticated) — delete plan (returns 204)
 *
 * V1 Controller: src/api/controllers/Plans/PlanController.ts
 * - All endpoints require authentication (class-level AuthCheck)
 * - No role gates on any endpoint
 * - No ownership checks
 *
 * Static routes (myPlan, checkout-session) registered before parameterized (:id)
 * so Express does not interpret them as IDs.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../shared/middleware/authenticate';
import { validate, schemas } from '../../shared/validation';
import { NotFoundError } from '../../shared/errors';
import * as plansService from './plans.service';

const router = Router();

// GET /pricing
// Paginated list of all plans
router.get(
  '/pricing',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const result = await plansService.getAll(page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// GET /pricing/myPlan
// Get current user's plan
router.get(
  '/pricing/myPlan',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await plansService.getMyPlan(req.user!.userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// POST /pricing/checkout-session
// Stripe checkout — DEFERRED to Phase 4
router.post(
  '/pricing/checkout-session',
  authenticate,
  async (_req: Request, res: Response) => {
    res.status(501).json({
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Stripe checkout session is deferred to Phase 4',
      },
    });
  }
);

// GET /pricing/:id
// Single plan by ID
router.get(
  '/pricing/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (!id || isNaN(id)) {
        throw new NotFoundError('Plan', req.params.id);
      }
      const result = await plansService.findOneById(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// POST /pricing
// Create a new plan
// Returns 201
router.post(
  '/pricing',
  authenticate,
  validate(schemas.plan.create),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await plansService.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /pricing/:id
// Update a plan
router.put(
  '/pricing/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (!id || isNaN(id)) {
        throw new NotFoundError('Plan', req.params.id);
      }
      const result = await plansService.updateOneById(id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /pricing/:id
// Delete a plan
// Returns 204 (no content)
router.delete(
  '/pricing/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (!id || isNaN(id)) {
        throw new NotFoundError('Plan', req.params.id);
      }
      await plansService.deleteOneById(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
