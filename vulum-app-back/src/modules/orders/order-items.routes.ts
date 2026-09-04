/**
 * Order Items Routes
 *
 * Preserves V1 API contract exactly.
 *   GET    /api/orderitems          (authenticated)
 *   GET    /api/orderitems/:id      (authenticated)
 *   POST   /api/orderitems          (authenticated)
 *   PUT    /api/orderitems/:id      (authenticated)
 *   DELETE /api/orderitems/:id      (authenticated)
 *
 * V1 Controller: src/api/controllers/OrderItems/OrderItemController.ts
 * - All endpoints require authentication (class-level AuthCheck)
 * - POST returns 201, DELETE returns 204
 */

import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../shared/middleware/authenticate';
import * as orderItemsService from './order-items.service';

const router = Router();

// GET /orderitems
router.get(
  '/orderitems',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const result = await orderItemsService.getAll(page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// GET /orderitems/:id
router.get(
  '/orderitems/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const result = await orderItemsService.findOneById(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// POST /orderitems
router.post(
  '/orderitems',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await orderItemsService.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /orderitems/:id
router.put(
  '/orderitems/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const result = await orderItemsService.updateOneById(id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /orderitems/:id
router.delete(
  '/orderitems/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await orderItemsService.deleteOneById(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
