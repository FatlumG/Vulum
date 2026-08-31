/**
 * Categories Routes
 *
 * Preserves V1 API contract exactly.
 * Frontend calls these endpoints:
 *   GET    /api/categories          (authenticated)
 *   GET    /api/categories/:id      (authenticated)
 *   POST   /api/categories          (authenticated, admin/manager)
 *   PUT    /api/categories/:id      (authenticated, admin/manager)
 *   DELETE /api/categories/:id      (authenticated, admin/manager)
 *
 * V1 Controller: src/api/controllers/Categories/CategoryController.ts
 * - All endpoints require authentication (class-level AuthCheck)
 * - update/delete additionally require: Admin, Super Admin, or Manager role
 * - POST returns 201, DELETE returns 204, PUT returns 200
 */

import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../shared/middleware/authenticate';
import { requireRole } from '../../shared/middleware/requireRole';
import { validate, schemas } from '../../shared/validation';
import * as categoriesService from './categories.service';

const router = Router();

// ============================================================
// GET /categories
// Paginated list of all categories
// V1: getAll — no role gate, just authentication
// ============================================================

router.get(
  '/categories',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;

      const result = await categoriesService.getAll(page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================
// GET /categories/:id
// Single category by ID
// V1: findOneById — no role gate, just authentication
// ============================================================

router.get(
  '/categories/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const result = await categoriesService.findOneById(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================
// POST /categories
// Create a new category
// V1: create — requires authentication, no explicit role gate
//   (V1 AuthCheck is class-level, no HasRole on create)
// Returns 201
// ============================================================

router.post(
  '/categories',
  authenticate,
  validate(schemas.category.create),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await categoriesService.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================
// PUT /categories/:id
// Update a category
// V1: update — requires Admin, Super Admin, or Manager role
// ============================================================

router.put(
  '/categories/:id',
  authenticate,
  requireRole('admin', 'super admin', 'manager'),
  validate(schemas.category.create), // V1 update uses same fields as create
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const result = await categoriesService.updateOneById(id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================
// DELETE /categories/:id
// Delete a category
// V1: delete — requires Admin, Super Admin, or Manager role
// Returns 204 (no content)
// ============================================================

router.delete(
  '/categories/:id',
  authenticate,
  requireRole('admin', 'super admin', 'manager'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await categoriesService.deleteOneById(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
