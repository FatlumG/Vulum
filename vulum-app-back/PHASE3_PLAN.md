# Phase 3A Implementation Plan

> **Scope:** Categories, Products + Product Images, Orders + Order Items, Favorites  
> **Endpoints:** ~30 new endpoints across 5 modules  
> **Pattern:** Each module follows `routes.ts` + `service.ts` + `types.ts`  
> **Status:** PLANNING — ready to implement

---

## Overview

Phase 3A implements the core CRUD modules that make up the business backbone of Vulum. Each module follows the exact same pattern established in Phase 2 (auth + users):

```
src/modules/<name>/
  <name>.routes.ts   — Express router with validation middleware
  <name>.service.ts  — Business logic + Drizzle ORM queries
  <name>.types.ts    — TypeScript types (already Zod schemas in shared/validation)
```

**Key principle:** All endpoints preserve V1 API contracts exactly. Frontend code should work without modification against V2 responses.

---

## Module 1: Categories

**V1 Route:** `/categories`  
**Complexity:** Low — standard CRUD, no user scoping  
**V2 Schema:** Already defined in `src/db/schema/categories.ts`

### Endpoints

| Method | Route | Auth | Role Gate | V1 Contract |
|--------|-------|------|-----------|-------------|
| GET | `/api/categories` | No | — | Paginated list |
| GET | `/api/categories/:id` | No | — | Single category |
| POST | `/api/categories` | Yes | Admin/Manager | Create category |
| PUT | `/api/categories/:id` | Yes | Admin/Manager | Update category |
| DELETE | `/api/categories/:id` | Yes | Admin/Manager | Delete category |

### Business Logic
- `getAll`: Drizzle query with pagination (page, limit from query params)
- `findOneById`: Single row lookup, throw `NotFoundError` if missing
- `create`: Insert with Zod validation, return created row
- `updateOneById`: Find-or-throw, then update with partial data
- `deleteOneById`: Delete by id, throw `NotFoundError` if missing

### Files to Create
- `src/modules/categories/categories.routes.ts`
- `src/modules/categories/categories.service.ts`

### Files to Modify
- `src/server.ts` — mount category routes
- `src/shared/validation/index.ts` — already has `categorySchemas`

---

## Module 2: Products + Product Images

**V1 Route:** `/products`  
**Complexity:** High — multiple query variants, ownership checks, image sub-resource, soft delete  
**V2 Schema:** Already defined in `src/db/schema/products.ts` and `src/db/schema/product-images.ts`

### Endpoints

| Method | Route | Auth | Role Gate | V1 Contract |
|--------|-------|------|-----------|-------------|
| GET | `/api/products` | Yes | Admin/Manager | All products (with images) |
| GET | `/api/products/available-products` | Yes | — | Products with status=available |
| GET | `/api/products/pending-products` | Yes | — | Products with status=pending |
| GET | `/api/products/unavailable-products` | Yes | — | Products with status=unavailable |
| GET | `/api/products/sold-products` | Yes | — | Products with status=sold |
| GET | `/api/products/my-products` | Yes | — | Products created by current user |
| GET | `/api/products/:id` | Yes | — | Single product with images + category |
| GET | `/api/products/:productName` | Yes | — | Search by name (LIKE query) |
| POST | `/api/products` | Yes | — | Create product (with images) |
| PUT | `/api/products/:id` | Yes | — | Update product |
| DELETE | `/api/products/:id` | Yes | — | Soft delete (set deletedAt) |

### Business Logic

**Query Variants:**
- `getAll`: Paginated list with productImages relation, admin/manager only
- `getAvailableProducts`: WHERE status='available', ORDER BY id DESC
- `getPendingProducts`: WHERE status='pending', ORDER BY id DESC
- `getUnavailableProducts`: WHERE status='unavailable', ORDER BY id DESC
- `getSoldProducts`: WHERE status='sold'
- `getMyProducts`: WHERE created_by = current user, ORDER BY created_at DESC
- `findOneById`: Join productImages + category, return full product
- `getProductsBySearch`: LIKE search on product_name and product_description

**Create (POST):**
- Validate with `productSchemas.create`
- Insert product with createdBy = current user
- **Stripe integration deferred to Phase 4** — V1 created Stripe product/price on create; V2 will skip this for now
- Insert product images (array of image URLs)
- Increment user's products counter (computed, not stored — see users.service)
- Return created product with images

**Update (PUT):**
- Find-or-throw, then update partial fields
- Product images: replace all images for the product (delete old, insert new)
- **V1 contract:** images are passed as an array in the request body

**Delete (DELETE):**
- Soft delete: set `deletedAt = new Date()` (products table has `deletedAt` column)
- V1 used hard delete; V2 uses soft delete per schema design decision

**Product Images:**
- Created/updated alongside the product (not separate CRUD endpoints in V1)
- Images are passed as `images: [{ url: '...' }]` in the product create/update body
- V1 used `ProductImagesService` as a separate service called from ProductController

### Files to Create
- `src/modules/products/products.routes.ts`
- `src/modules/products/products.service.ts`
- `src/modules/products/product-images.service.ts` (or inline in products.service)

### Files to Modify
- `src/server.ts` — mount product routes
- `src/shared/validation/index.ts` — already has `productSchemas`

---

## Module 3: Orders + Order Items

**V1 Routes:** `/orders` and `/orderitems`  
**Complexity:** Medium — ownership scoping, nested order items, Stripe checkout (deferred)  
**V2 Schema:** Already defined in `src/db/schema/orders.ts` and `src/db/schema/order-items.ts`

### Endpoints

**Orders:**

| Method | Route | Auth | Role Gate | V1 Contract |
|--------|-------|------|-----------|-------------|
| GET | `/api/orders` | Yes | — | Paginated list |
| GET | `/api/orders/:id` | Yes | — | Single order |
| POST | `/api/orders` | Yes | — | Create checkout session (Stripe deferred) |
| PUT | `/api/orders/:id` | Yes | — | Update order |
| DELETE | `/api/orders/:id` | Yes | — | Delete order |

**Order Items:**

| Method | Route | Auth | Role Gate | V1 Contract |
|--------|-------|------|-----------|-------------|
| GET | `/api/orderitems` | Yes | — | Paginated list |
| GET | `/api/orderitems/:id` | Yes | — | Single order item |
| POST | `/api/orderitems` | Yes | — | Create order item |
| PUT | `/api/orderitems/:id` | Yes | — | Update order item |
| DELETE | `/api/orderitems/:id` | Yes | — | Delete order item |

### Business Logic

**Orders:**
- `getAll`: Paginated list of orders
- `findOneById`: Single order with orderItems relation
- `create`: V1 created a Stripe checkout session; V2 will create the order + order items + invoice record WITHOUT Stripe (Phase 4). The `createCheckoutSession` method in V1 validates:
  - Items array is non-empty
  - All products exist
  - User is not buying their own product
  - Quantities are positive
  - Sufficient stock
  - Creates order, order items, invoice record
  - V2 will replicate this logic without the Stripe session creation
- `updateOneById`: Update order status/fields
- `deleteOneById`: Delete order (cascade deletes order items per schema)

**Order Items:**
- Standard CRUD, no special business logic
- Created alongside orders or independently
- Each item references an order_id and product_id

### Files to Create
- `src/modules/orders/orders.routes.ts`
- `src/modules/orders/orders.service.ts`
- `src/modules/orders/order-items.routes.ts`
- `src/modules/orders/order-items.service.ts`

### Files to Modify
- `src/server.ts` — mount order routes

---

## Module 4: Favorites

**V1 Route:** `/favorites`  
**Complexity:** Medium — user-scoped, composite unique, "get my favorites" with product join  
**V2 Schema:** Already defined in `src/db/schema/favorites.ts`

### Endpoints

| Method | Route | Auth | Role Gate | V1 Contract |
|--------|-------|------|-----------|-------------|
| GET | `/api/favorites` | Yes | — | Paginated list |
| GET | `/api/favorites/:id` | Yes | — | Single favorite |
| GET | `/api/favorites/get-my-favorites` | Yes | — | Current user's favorites (paginated) |
| POST | `/api/favorites` | Yes | — | Add to favorites |
| PUT | `/api/favorites/:id` | Yes | — | Update favorite |
| DELETE | `/api/favorites/:id` | Yes | — | Remove from favorites |

### Business Logic

**Create (POST):**
- Validate: `product_id` required
- Check for existing favorite (composite unique on user_id + product_id)
- If duplicate → throw `ConflictError('This Product is already saved!')`
- Insert favorite with `user_id` from JWT
- Return favorite with user and product joins
- **V1 incremented user's favorites counter** — V2 computes this instead

**getMyFavorites:**
- Paginated query WHERE user_id = current user
- Join product → productImages for each favorite
- Return `{ items, total, page, totalPages }`

**Delete (DELETE):**
- Delete by id
- Throw `NotFoundError` if missing

### Files to Create
- `src/modules/favorites/favorites.routes.ts`
- `src/modules/favorites/favorites.service.ts`

### Files to Modify
- `src/server.ts` — mount favorite routes
- `src/shared/validation/index.ts` — already has `favoriteSchemas`

---

## Server Registration

All new routes get mounted in `src/server.ts`:

```typescript
// Module routes (Phase 2)
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';

// Module routes (Phase 3A)
import categoriesRoutes from './modules/categories/categories.routes';
import productsRoutes from './modules/products/products.routes';
import ordersRoutes from './modules/orders/orders.routes';
import orderItemsRoutes from './modules/orders/order-items.routes';
import favoritesRoutes from './modules/favorites/favorites.routes';

// Mount
app.use('/api', authRoutes);
app.use('/api', usersRoutes);
app.use('/api', categoriesRoutes);
app.use('/api', productsRoutes);
app.use('/api', ordersRoutes);
app.use('/api', orderItemsRoutes);
app.use('/api', favoritesRoutes);
```

---

## Validation Schemas

All Zod schemas are already defined in `src/shared/validation/index.ts`:

| Module | Schema | Status |
|--------|--------|--------|
| Categories | `categorySchemas.create` | ✅ Exists |
| Products | `productSchemas.create`, `productSchemas.update` | ✅ Exists |
| Orders | `orderSchemas.create` | ✅ Exists |
| Favorites | `favoriteSchemas.create` | ✅ Exists |

**No new validation schemas needed.** All required schemas are already in place.

---

## V1 Field Name Mapping

Critical for frontend compatibility. V2 responses must use the SAME field names as V1:

| Table | V2 Column | V1 Field Name |
|-------|-----------|---------------|
| products | `productName` | `product_name` |
| products | `productDescription` | `product_description` |
| products | `categoryId` | `category_id` |
| products | `createdBy` | `created_by` |
| products | `stripePriceId` | `stripe_price_id` |
| products | `stripeProductId` | `stripe_product_id` |
| products | `deletedAt` | `deleted_at` |
| orders | `createdBy` | `created_by` |
| orderItems | `orderId` | `order_id` |
| orderItems | `productId` | `product_id` |
| orderItems | `totalAmount` | `total_amount` |
| favorites | `userId` | `user_id` |
| favorites | `productId` | `product_id` |
| categories | `categoryName` | `category_name` |
| categories | `categoryDescription` | `category_description` |

**Service layer must map Drizzle camelCase → V1 snake_case** in all responses.

---

## Implementation Order

1. **Categories** (30 min) — Simplest module, establishes the pattern for role-gated CRUD
2. **Products + Images** (1-2 hrs) — Most complex, multiple query variants, soft delete
3. **Orders + Order Items** (1 hr) — Depends on products, checkout logic
4. **Favorites** (30 min) — User-scoped, duplicate detection, paginated "my" query
5. **Wire into server.ts** (5 min)
6. **TypeScript check** (5 min)
7. **Integration tests** (30 min)

---

## Deferred to Phase 3B / Phase 4

- **Stripe checkout session** in Orders (needs Stripe API keys)
- **Invoice creation** during checkout (tied to Stripe flow)
- **Sales** module (depends on completed orders)
- **Pendings** module (product approval workflow)
- **Plans + Subscriptions** (Stripe-adjacent)
- **Chat** (WebSocket infrastructure)
- **Cloudinary image upload** (profile pictures, product images)

---

## Acceptance Criteria

- [ ] All ~30 new endpoints return correct data from PostgreSQL
- [ ] V2 response field names match V1 exactly (snake_case)
- [ ] Pagination works consistently across all list endpoints
- [ ] Role-gated endpoints return 403 for unauthorized roles
- [ ] Ownership checks enforce users can only modify their own resources
- [ ] Duplicate detection works (favorites composite unique)
- [ ] Soft delete works for products
- [ ] TypeScript compiles with zero V2 source errors
- [ ] V1 code and MySQL remain completely untouched
- [ ] All endpoints tested via integration tests against live PostgreSQL
