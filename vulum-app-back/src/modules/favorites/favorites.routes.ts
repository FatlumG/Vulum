/**
 * Favorites Routes
 *
 * Preserves V1 API contract exactly.
 *   GET    /api/favorites              (authenticated)
 *   GET    /api/favorites/get-my-favorites (authenticated) — MUST be before /:id
 *   GET    /api/favorites/:id          (authenticated)
 *   POST   /api/favorites              (authenticated)
 *   PUT    /api/favorites/:id          (authenticated)
 *   DELETE /api/favorites/:id          (authenticated)
 *
 * V1 Controller: src/api/controllers/Favorites/FavoriteController.ts
 * - All endpoints require authentication (class-level AuthCheck)
 * - No role gates on any endpoint
 * - POST returns 201, DELETE returns 204
 * - getMyFavorites returns paginated results with product+images joins
 */

import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../shared/middleware/authenticate';
import { validate, schemas } from '../../shared/validation';
import * as favoritesService from './favorites.service';

const router = Router();

// ============================================================
// IMPORTANT: Static routes MUST come before parameterized routes
// /favorites/get-my-favorites before /favorites/:id
// ============================================================

// GET /favorites
router.get(
  '/favorites',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const result = await favoritesService.getAll(page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// GET /favorites/get-my-favorites
router.get(
  '/favorites/get-my-favorites',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const result = await favoritesService.getMyFavorites(req.user!.userId, page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// GET /favorites/:id
router.get(
  '/favorites/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const result = await favoritesService.findOneById(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// POST /favorites
router.post(
  '/favorites',
  authenticate,
  validate(schemas.favorite.create),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await favoritesService.create(
        req.body.product_id,
        req.user!.userId
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /favorites/:id
router.put(
  '/favorites/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const result = await favoritesService.updateOneById(id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /favorites/:id
router.delete(
  '/favorites/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await favoritesService.deleteOneById(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
