/**
 * Sales Routes
 *
 * Preserves V1 API contract exactly.
 *   GET    /api/sales              (authenticated)
 *   GET    /api/sales/:id          (authenticated)
 *   POST   /api/sales              (authenticated)
 *   PUT    /api/sales/:id          (authenticated)
 *   DELETE /api/sales/:id          (authenticated)
 *
 * V1 Controller: src/api/controllers/Sales/SaleController.ts
 * - All endpoints require authentication (class-level AuthCheck)
 * - No role gates on any endpoint
 * - POST returns 201, DELETE returns 204
 * - Request body: { order_id, user_id, total_price }
 */

import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../shared/middleware/authenticate';
import * as salesService from './sales.service';

const router = Router();

// GET /sales
// Paginated list of all sales
router.get(
  '/sales',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const result = await salesService.getAll(page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// GET /sales/:id
// Single sale by ID
router.get(
  '/sales/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const result = await salesService.findOneById(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// POST /sales
// Create a new sale
// Returns 201
router.post(
  '/sales',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await salesService.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /sales/:id
// Update a sale
router.put(
  '/sales/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const result = await salesService.updateOneById(id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /sales/:id
// Delete a sale
// Returns 204 (no content)
router.delete(
  '/sales/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await salesService.deleteOneById(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
