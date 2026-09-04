/**
 * Invoices Routes
 *
 * Preserves V1 API contract exactly.
 *   GET    /api/invoices              (authenticated)
 *   GET    /api/invoices/get-my-invoices (authenticated) — MUST be before /:id
 *   GET    /api/invoices/:id          (authenticated)
 *   POST   /api/invoices              (authenticated)
 *   PUT    /api/invoices/:id          (authenticated)
 *   DELETE /api/invoices/:id          (authenticated)
 *
 * V1 Controller: src/api/controllers/Invoices/InvoiceController.ts
 * - All endpoints require authentication (class-level AuthCheck)
 * - No role gates on any endpoint
 * - POST returns 201, DELETE returns 204
 * - getMyInvoices returns paginated results with order+items+product+images joins
 */

import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../shared/middleware/authenticate';
import { validate, schemas } from '../../shared/validation';
import * as invoicesService from './invoices.service';

const router = Router();

// ============================================================
// IMPORTANT: Static routes MUST come before parameterized routes
// /invoices/get-my-invoices before /invoices/:id
// ============================================================

// GET /invoices
// Paginated list of all invoices
router.get(
  '/invoices',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const result = await invoicesService.getAll(page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// GET /invoices/get-my-invoices
// Current user's invoices with order+items+product+images joins
router.get(
  '/invoices/get-my-invoices',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const result = await invoicesService.getMyInvoices(
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

// GET /invoices/:id
// Single invoice by ID
router.get(
  '/invoices/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const result = await invoicesService.findOneById(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// POST /invoices
// Create a new invoice
// Returns 201
router.post(
  '/invoices',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await invoicesService.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /invoices/:id
// Update an invoice
router.put(
  '/invoices/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const result = await invoicesService.updateOneById(id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /invoices/:id
// Delete an invoice
// Returns 204 (no content)
router.delete(
  '/invoices/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await invoicesService.deleteOneById(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
