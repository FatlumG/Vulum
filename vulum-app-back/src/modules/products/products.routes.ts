/**
 * Products Routes
 *
 * Preserves V1 API contract exactly.
 * Frontend calls these endpoints:
 *   GET    /api/products                    (authenticated, admin/manager)
 *   GET    /api/products/available-products  (authenticated)
 *   GET    /api/products/pending-products    (authenticated)
 *   GET    /api/products/unavailable-products (authenticated)
 *   GET    /api/products/sold-products       (authenticated)
 *   GET    /api/products/my-products         (authenticated)
 *   GET    /api/products/:id                 (authenticated)
 *   GET    /api/products/:productName        (authenticated, search)
 *   POST   /api/products                     (authenticated)
 *   PUT    /api/products/:id                 (authenticated, admin/manager)
 *   PATCH  /api/products/:id                 (authenticated, admin/manager)
 *   DELETE /api/products/:id                 (authenticated, admin/manager)
 *   GET    /api/products/images              (authenticated)
 *   GET    /api/products/:id/images          (authenticated)
 *
 * V1 Controller: src/api/controllers/Products/ProductController.ts
 * - All endpoints require authentication (class-level AuthCheck)
 * - getAll, PUT, PATCH, DELETE additionally require: Admin, Super Admin, Manager
 * - POST returns 201, DELETE returns 204
 * - create accepts: { product: {...}, images: [{image_url: "..."}] }
 */

import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../shared/middleware/authenticate';
import { requireRole } from '../../shared/middleware/requireRole';
import { schemas } from '../../shared/validation';
import { validate } from '../../shared/validation';
import * as productsService from './products.service';

const router = Router();

// ============================================================
// IMPORTANT: Static routes MUST come before parameterized routes
// /products/available-products before /products/:id
// ============================================================

// ============================================================
// GET /products
// All products with images (admin/manager only)
// ============================================================

router.get(
  '/products',
  authenticate,
  requireRole('admin', 'super admin', 'manager'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const result = await productsService.getAll(page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================
// GET /products/available-products
// ============================================================

router.get(
  '/products/available-products',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const result = await productsService.getAvailableProducts(page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================
// GET /products/pending-products
// ============================================================

router.get(
  '/products/pending-products',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const result = await productsService.getPendingProducts(page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================
// GET /products/unavailable-products
// ============================================================

router.get(
  '/products/unavailable-products',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const result = await productsService.getUnavailableProducts(page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================
// GET /products/sold-products
// ============================================================

router.get(
  '/products/sold-products',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const result = await productsService.getSoldProducts(page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================
// GET /products/my-products
// Products created by the current user
// ============================================================

router.get(
  '/products/my-products',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await productsService.getMyProducts(req.user!.userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================
// GET /products/images
// All product images
// ============================================================

router.get(
  '/products/images',
  authenticate,
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await productsService.getAllImages();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================
// GET /products/:id/images
// Images for a specific product
// ============================================================

router.get(
  '/products/:id/images',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const result = await productsService.getImagesByProductId(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================
// GET /products/:idOrName
// V1 had two routes: /:id([0-9]+) and /:productName([a-zA-Z]+)
// Express can't disambiguate without regex, so we check at runtime:
//   - If param is numeric → findOneById
//   - If param is alphabetic → search by name
// ============================================================

router.get(
  '/products/:idOrName',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const param = req.params.idOrName;
      const numericId = Number(param);

      if (!isNaN(numericId) && String(numericId) === param) {
        // Numeric → fetch by ID
        const result = await productsService.findOneById(numericId);
        if (!result) {
          return next(new (await import('../../shared/errors')).NotFoundError('Product', numericId));
        }
        return res.json(result);
      }

      // Alphabetic → search by name
      const result = await productsService.getProductsBySearch(param);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================
// POST /products
// Create product with images
// V1: accepts { product: {...}, images: [{image_url: "..."}] }
// Returns 201
// ============================================================

router.post(
  '/products',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await productsService.create(req.body, req.user!.userId);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================
// PUT /products/:id
// Update product fields (admin/manager only)
// ============================================================

router.put(
  '/products/:id',
  authenticate,
  requireRole('admin', 'super admin', 'manager'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const result = await productsService.updateOneById(id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================
// PATCH /products/:id
// Update product status only (admin/manager only)
// ============================================================

router.patch(
  '/products/:id',
  authenticate,
  requireRole('admin', 'super admin', 'manager'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const result = await productsService.updateStatusById(id, req.body.status);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================
// DELETE /products/:id
// Soft delete (admin/manager only)
// Returns 204
// ============================================================

router.delete(
  '/products/:id',
  authenticate,
  requireRole('admin', 'super admin', 'manager'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await productsService.deleteOneById(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
