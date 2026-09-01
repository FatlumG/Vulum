/**
 * Pendings Routes
 *
 * Preserves V1 API contract exactly.
 *   GET    /api/pendings              (authenticated) — returns orders WHERE status='pending'
 *   GET    /api/pendings/getMyPendings (authenticated) — MUST be before /:id
 *   GET    /api/pendings/:id          (authenticated) — returns pending record
 *   POST   /api/pendings              (authenticated)
 *   PUT    /api/pendings/:id          (authenticated)
 *   DELETE /api/pendings/:id          (authenticated)
 *
 * V1 Controller: src/api/controllers/Pendings/PendingController.ts
 * - All endpoints require authentication (class-level AuthCheck)
 * - No role gates on any endpoint
 * - POST returns 201, DELETE returns 204
 * - getAll returns orders WHERE status='pending' (NOT pendings table!)
 * - getMyPendings returns orders WHERE status='pending' AND created_by=user
 * - findOneById, create, update, delete operate on the pendings table
 */

import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../shared/middleware/authenticate';
import * as pendingsService from './pendings.service';

const router = Router();

// ============================================================
// IMPORTANT: Static routes MUST come before parameterized routes
// /pendings/getMyPendings before /pendings/:id
// ============================================================

// GET /pendings
// V1: returns orders WHERE status='pending'
router.get(
  '/pendings',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const result = await pendingsService.getAll(page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// GET /pendings/getMyPendings
// V1: returns orders WHERE status='pending' AND created_by=current user
router.get(
  '/pendings/getMyPendings',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const result = await pendingsService.getMyPendings(
        req.user!.userId,
        page,
        limit
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// GET /pendings/:id
// V1: returns a single pending record from pendings table
router.get(
  '/pendings/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const result = await pendingsService.findOneById(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// POST /pendings
// V1: creates a pending record (body: { order_id }, user_id from JWT)
// Returns 201
router.post(
  '/pendings',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await pendingsService.create(
        req.body,
        req.user!.userId
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /pendings/:id
// V1: updates a pending record
router.put(
  '/pendings/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const result = await pendingsService.updateOneById(id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /pendings/:id
// V1: deletes a pending record
// Returns 204 (no content)
router.delete(
  '/pendings/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await pendingsService.deleteOneById(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
