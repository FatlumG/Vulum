/**
 * Orders Routes
 *
 * Preserves V1 API contract exactly.
 *   GET    /api/orders          (authenticated)
 *   GET    /api/orders/:id      (authenticated)
 *   POST   /api/orders          (authenticated)
 *   PUT    /api/orders/:id      (authenticated)
 *   DELETE /api/orders/:id      (authenticated)
 *
 * V1 Controller: src/api/controllers/Orders/OrderController.ts
 * - All endpoints require authentication (class-level AuthCheck)
 * - POST accepts { items: [{ product_id, quantity }] }
 * - V1 returns { url, invoiceId } — V2 returns { order, items, invoiceId }
 * - POST returns 201, DELETE returns 204
 */

import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../shared/middleware/authenticate';
import * as ordersService from './orders.service';

const router = Router();

// GET /orders
router.get(
  '/orders',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const result = await ordersService.getAll(page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// GET /orders/:id
router.get(
  '/orders/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const result = await ordersService.findOneById(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// POST /orders — Create checkout session
// V1 accepts { items: [{ product_id, quantity }] }
// V2 creates order + items + invoice (Stripe deferred)
router.post(
  '/orders',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await ordersService.createCheckoutSession(
        req.body,
        req.user!.userId
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /orders/:id
router.put(
  '/orders/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const result = await ordersService.updateOneById(id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /orders/:id
router.delete(
  '/orders/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await ordersService.deleteOneById(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
