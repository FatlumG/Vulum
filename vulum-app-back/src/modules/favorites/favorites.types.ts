/**
 * Favorites Types
 *
 * V1 field mapping:
 *   userId → user_id
 *   productId → product_id
 *   createdAt → created_at
 *
 * V1 create returns: { id, user_id, product_id, created_at, user: {...}, product: {...} }
 * V1 getMyFavorites returns: { items: [...], total, page, totalPages }
 *   — each item has product + productImages joins
 */

/** Favorite as returned in API responses (V1 field names) */
export interface FavoriteResponse {
  id: number;
  user_id: number;
  product_id: number;
  created_at: Date;
}

/** User subset returned in favorite create response */
export interface FavoriteUserResponse {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  favorites: number;
}

/** Product subset returned in favorite create response */
export interface FavoriteProductResponse {
  product_name: string;
  product_description: string;
  price: string;
}

/** Full favorite with user and product (V1 create response) */
export interface FavoriteWithRelationsResponse extends FavoriteResponse {
  user: FavoriteUserResponse;
  product: FavoriteProductResponse;
}

/** Product in my-favorites list (with images) */
export interface FavoriteProductWithImages {
  id: number;
  product_name: string;
  product_description: string;
  price: string;
  stock: number;
  category_id: number;
  created_by: number | null;
  status: string;
  product_images?: {
    id: number;
    image_url: string;
    product_id: number;
    created_at: Date;
  }[];
}

/** Favorite in my-favorites list */
export interface MyFavoriteItem {
  id: number;
  user_id: number;
  product_id: number;
  created_at: Date;
  product: FavoriteProductWithImages;
}

/** Request body for creating a favorite */
export interface CreateFavoriteInput {
  product_id: number;
}

/** Request body for updating a favorite */
export interface UpdateFavoriteInput {
  user_id: number;
  product_id: number;
}

/** Paginated my-favorites response */
export interface MyFavoritesListResponse {
  items: MyFavoriteItem[];
  total: number;
  page: number;
  totalPages: number;
}

/** Paginated list response */
export interface FavoriteListResponse {
  items: FavoriteResponse[];
  total: number;
  page: number;
  totalPages: number;
}
