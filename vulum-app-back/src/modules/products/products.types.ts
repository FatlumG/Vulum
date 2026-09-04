/**
 * Products Types
 *
 * TypeScript interfaces for the Products module.
 * Zod validation schemas are in shared/validation/index.ts.
 *
 * V1 field mapping (Drizzle camelCase → V1 snake_case):
 *   productName → product_name
 *   productDescription → product_description
 *   categoryId → category_id
 *   createdBy → created_by
 *   stripePriceId → stripe_price_id
 *   stripeProductId → stripe_product_id
 *   deletedAt → deleted_at
 *   createdAt → created_at
 *   updatedAt → updated_at
 */

/** Product as returned in API responses (V1 field names) */
export interface ProductResponse {
  id: number;
  product_name: string;
  product_description: string;
  price: string;
  stock: number;
  category_id: number;
  created_by: number | null;
  status: string;
  stripe_price_id: string | null;
  stripe_product_id: string | null;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

/** Product image as returned in API responses */
export interface ProductImageResponse {
  id: number;
  image_url: string;
  product_id: number;
  created_at: Date;
}

/** Product with images and category (for single product fetch) */
export interface ProductDetailResponse extends ProductResponse {
  product_images?: ProductImageResponse[];
  category?: {
    id: number;
    category_name: string;
    category_description: string;
  };
}

/** Request body for creating a product with images */
export interface CreateProductInput {
  product_name: string;
  product_description: string;
  price: number;
  stock: number;
  category_id: number;
}

export interface CreateProductWithImagesInput {
  product: CreateProductInput;
  images: { image_url: string }[];
}

/** Request body for updating a product */
export interface UpdateProductInput {
  product_name?: string;
  product_description?: string;
  price?: number;
  stock?: number;
  category_id?: number;
  status?: string;
}

/** Request body for updating product status */
export interface UpdateStatusInput {
  status: string;
}

/** Paginated list response */
export interface ProductListResponse {
  items: ProductResponse[];
  total: number;
  page: number;
  totalPages: number;
}
