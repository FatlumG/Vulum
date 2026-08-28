/**
 * Categories Types
 *
 * TypeScript interfaces for the Categories module.
 * Zod validation schemas are in shared/validation/index.ts.
 *
 * V1 field mapping:
 *   V2 camelCase → V1 snake_case in responses
 *   categoryName → category_name
 *   categoryDescription → category_description
 */

/** Request body for creating a category */
export interface CreateCategoryInput {
  category_name: string;
  category_description: string;
}

/** Request body for updating a category */
export interface UpdateCategoryInput {
  category_name: string;
  category_description: string;
}

/** Category as returned in API responses (V1 field names) */
export interface CategoryResponse {
  id: number;
  category_name: string;
  category_description: string;
  created_at: Date;
  updated_at: Date;
}

/** Paginated list response */
export interface CategoryListResponse {
  items: CategoryResponse[];
  total: number;
  page: number;
  totalPages: number;
}
