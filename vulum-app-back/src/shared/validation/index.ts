/**
 * Zod Validation Foundation for V2 Backend
 *
 * Provides:
 * 1. Common Zod schemas for shared types
 * 2. Express middleware for request validation
 * 3. Type inference for TypeScript
 *
 * Usage:
 *   import { validate, schemas } from '@/shared/validation';
 *
 *   // In route handler:
 *   router.post('/users', validate(schemas.user.create), async (req, res) => {
 *     // req.body is validated and typed
 *   });
 */

import { z, ZodSchema, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../errors';

// ============================================================
// Common Schemas
// ============================================================

/**
 * Pagination query parameters
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

/**
 * ID parameter (used in route params)
 */
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type IdParam = z.infer<typeof idParamSchema>;

/**
 * Common string fields
 */
export const emailSchema = z.string().email('Invalid email address');
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters');
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(50, 'Username must be at most 50 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores');

// ============================================================
// Module Schemas
// ============================================================

/**
 * Auth schemas
 */
export const authSchemas = {
  login: z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required'),
  }),

  register: z.object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
    first_name: z.string().min(1, 'First name is required').max(191),
    last_name: z.string().min(1, 'Last name is required').max(191),
  }),
};

/**
 * User schemas
 */
export const userSchemas = {
  update: z.object({
    first_name: z.string().min(1).max(191).optional(),
    last_name: z.string().min(1).max(191).optional(),
    bio: z.string().max(1000).optional(),
    phone: z.string().max(20).optional(),
    address: z.string().max(500).optional(),
    profile_photo_url: z.string().url().optional(),
  }),
};

/**
 * Product schemas
 */
export const productSchemas = {
  create: z.object({
    product_name: z.string().min(1, 'Product name is required').max(255),
    product_description: z.string().min(1, 'Description is required'),
    price: z.coerce.number().min(0, 'Price must be non-negative'),
    stock: z.coerce.number().int().min(0).default(1),
    category_id: z.coerce.number().int().positive('Category is required'),
    status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
  }),

  update: z.object({
    product_name: z.string().min(1).max(255).optional(),
    product_description: z.string().min(1).optional(),
    price: z.coerce.number().min(0).optional(),
    stock: z.coerce.number().int().min(0).optional(),
    category_id: z.coerce.number().int().positive().optional(),
    status: z.enum(['pending', 'approved', 'rejected']).optional(),
  }),
};

/**
 * Order schemas
 */
export const orderSchemas = {
  create: z.object({
    items: z
      .array(
        z.object({
          product_id: z.coerce.number().int().positive(),
          quantity: z.coerce.number().int().min(1).default(1),
        })
      )
      .min(1, 'At least one item is required'),
  }),
};

/**
 * Favorite schemas
 */
export const favoriteSchemas = {
  create: z.object({
    product_id: z.coerce.number().int().positive('Product ID is required'),
  }),
};

/**
 * Invoice schemas
 */
export const invoiceSchemas = {
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    status: z.enum(['draft', 'open', 'paid', 'void', 'uncollectible']).optional(),
  }),
};

/**
 * Plan schemas
 */
export const planSchemas = {
  create: z.object({
    plan_name: z.string().min(1, 'Plan name is required').max(255),
    plan_description: z.string().min(1, 'Description is required'),
    price: z.coerce.number().min(0, 'Price must be non-negative'),
    billing_cycle: z.enum(['monthly', 'yearly', 'none']).default('none'),
    stripe_price_id: z.string().optional(),
    stripe_product_id: z.string().optional(),
  }),
};

/**
 * Category schemas
 */
export const categorySchemas = {
  create: z.object({
    category_name: z.string().min(1, 'Category name is required').max(255),
    category_description: z.string().min(1, 'Description is required'),
  }),
};

// ============================================================
// Validation Middleware
// ============================================================

/**
 * Express middleware factory for request validation.
 *
 * Validates req.body, req.query, and req.params against the provided schema.
 * Throws ValidationError if validation fails.
 *
 * Usage:
 *   router.post('/users', validate(schemas.user.create), handler);
 *   router.get('/users/:id', validate(schemas.idParam, 'params'), handler);
 */
export function validate(
  schema: ZodSchema,
  source: 'body' | 'query' | 'params' = 'body'
) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const data = schema.parse(req[source]);
      // Replace with parsed (and coerced) data
      req[source] = data;
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err: z.ZodIssue) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        next(
          new ValidationError('Validation failed', {
            errors: formattedErrors,
          })
        );
      } else {
        next(error);
      }
    }
  };
}

// ============================================================
// Export all schemas
// ============================================================

export const schemas = {
  pagination: paginationSchema,
  idParam: idParamSchema,
  auth: authSchemas,
  user: userSchemas,
  product: productSchemas,
  order: orderSchemas,
  favorite: favoriteSchemas,
  invoice: invoiceSchemas,
  plan: planSchemas,
  category: categorySchemas,
};
