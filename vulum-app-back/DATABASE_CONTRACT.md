# Vulum Database Contract — Phase 1 Baseline

> This document is the single source of truth for the current Vulum database.
> It captures the schema as it exists today in MySQL 8 via TypeORM 0.2.x.
> No changes should be made based on this document alone — it is a reference baseline.

---

## 1. INFRASTRUCTURE

| Component | Value |
|-----------|-------|
| Database Engine | MySQL 8.0 |
| ORM | TypeORM 0.2.37 |
| Driver | mysql2 2.3.0 |
| Connection Method | `createConnection()` (deprecated in 0.3) |
| Entity Base | `EntityBase extends BaseEntity` (Active Record pattern) |
| Repository Base | `RepositoryBase<T> extends MainRepository<T>` (typeorm-simple-query-parser) |
| DI Container | typedi + typeorm-typedi-extensions |
| Seeding | typeorm-seeding 1.6.1 |
| Docker | mysql:8.0 image |
| Config Source | Environment variables (TYPEORM_*) |

### Connection Configuration

Read from `src/config/db.ts`:
- `TYPEORM_CONNECTION` → database driver (currently `mysql`)
- `TYPEORM_HOST` → database host
- `TYPEORM_PORT` → database port (3306 for MySQL)
- `TYPEORM_DATABASE` → database name
- `TYPEORM_USERNAME` → database user
- `TYPEORM_PASSWORD` → database password
- `TYPEORM_ENTITIES` → entity file glob path
- `TYPEORM_LOGGING` → boolean flag

---

## 2. TABLES & SCHEMA

### 2.1 — `users`

| Column | Type | Nullable | Default | Unique | Notes |
|--------|------|----------|---------|--------|-------|
| `id` | bigint (PK, auto-increment) | NO | — | YES | PrimaryGeneratedColumn('increment') |
| `username` | varchar | NO | — | YES | Unique constraint |
| `bio` | varchar | NO | — | NO | Required at entity level |
| `first_name` | varchar | NO | — | NO | |
| `last_name` | varchar | NO | — | NO | |
| `profile_photo_url` | varchar | YES | NULL | NO | Cloudinary URL |
| `email` | varchar | NO | — | YES | Unique constraint |
| `password` | varchar | NO | — | NO | Excluded from serialization (@Exclude) |
| `phone` | varchar | YES | NULL | NO | |
| `pricing_plan` | int (FK → pricing.id) | YES | NULL | NO | ManyToOne → Plan |
| `products` | int | NO | 0 | NO | **Denormalized counter** |
| `orders` | int | NO | 0 | NO | **Denormalized counter** |
| `sales` | int | NO | 0 | NO | **Denormalized counter** |
| `favorites` | int | NO | 0 | NO | **Denormalized counter** |
| `pendings` | int | NO | 0 | NO | **Denormalized counter** |
| `todos` | int | NO | 0 | NO | **Denormalized counter** — no entity uses this |
| `payments` | int | NO | 0 | NO | **Denormalized counter** — no entity uses this |
| `address` | varchar | YES | NULL | NO | |
| `role_id` | int (FK → roles.id) | NO | 5 | NO | Default role ID = 5 |
| `stripe_customer_id` | varchar | YES | NULL | NO | Stripe customer reference |

**Entity file:** `src/api/models/Users/User.ts`

**Lifecycle hooks:**
- `@BeforeInsert` → hash password (bcrypt)
- `@BeforeUpdate` → hash password if not already hashed (checks `$2b$` prefix)
- `@BeforeInsert` → set default role_id to 5 if not provided

---

### 2.2 — `roles`

| Column | Type | Nullable | Default | Unique | Notes |
|--------|------|----------|---------|--------|-------|
| `id` | bigint (PK, auto-increment) | NO | — | YES | PrimaryGeneratedColumn('increment') |
| `role_name` | varchar | NO | — | NO | |

**Entity file:** `src/api/models/Users/Role.ts`

**Note:** The migration creates a column named `name`, but the entity uses `role_name`. This is a known discrepancy.

---

### 2.3 — `products`

| Column | Type | Nullable | Default | Unique | Notes |
|--------|------|----------|---------|--------|-------|
| `id` | int (PK, auto-increment) | NO | — | YES | PrimaryGeneratedColumn('increment') |
| `product_name` | varchar | NO | — | NO | |
| `product_description` | varchar | NO | — | NO | |
| `price` | decimal(8,2) | NO | 0 | NO | |
| `stock` | int | NO | 1 | NO | |
| `category_id` | int (FK → categories.id) | NO | — | NO | |
| `created_at` | timestamp | NO | CURRENT_TIMESTAMP | NO | |
| `created_by` | int (FK → users.id) | NO | — | NO | |
| `status` | enum('pending','unavailable','available','sold') | NO | 'pending' | NO | MySQL enum |
| `stripe_price_id` | varchar | NO | — | NO | |
| `stripe_product_id` | varchar | NO | — | NO | |

**Entity file:** `src/api/models/Products/Product.ts`

---

### 2.4 — `orders`

| Column | Type | Nullable | Default | Unique | Notes |
|--------|------|----------|---------|--------|-------|
| `id` | int (PK, auto-increment) | NO | — | YES | PrimaryGeneratedColumn('increment') |
| `name` | varchar | NO | — | NO | Format: "Order-{timestamp}" |
| `amount` | decimal(8,2) | NO | 0 | NO | |
| `status` | varchar | NO | 'pending' | NO | Stores OrderStatus enum values as strings |
| `created_at` | timestamp | NO | CURRENT_TIMESTAMP | NO | |
| `created_by` | int (FK → users.id) | NO | — | NO | |

**Entity file:** `src/api/models/Orders/Order.ts`

**Status values (OrderStatus enum):** pending, approved, confirmed, processing, shipped, delivered, cancelled, rejected, returned, refunded

---

### 2.5 — `order_items`

| Column | Type | Nullable | Default | Unique | Notes |
|--------|------|----------|---------|--------|-------|
| `id` | int (PK, auto-increment) | NO | — | YES | PrimaryGeneratedColumn('increment') |
| `order_id` | int (FK → orders.id) | NO | — | NO | onDelete: CASCADE |
| `product_id` | int (FK → products.id) | NO | — | NO | onDelete: CASCADE |
| `quantity` | int | NO | — | NO | |
| `total_amount` | decimal(8,2) | NO | 0 | NO | |
| `created_at` | timestamp | NO | CURRENT_TIMESTAMP | NO | |

**Entity file:** `src/api/models/OrderItems/OrderItem.ts`

---

### 2.6 — `invoices`

| Column | Type | Nullable | Default | Unique | Notes |
|--------|------|----------|---------|--------|-------|
| `id` | int (PK, auto-increment) | NO | — | YES | PrimaryGeneratedColumn('increment') |
| `stripe_invoice_id` | varchar | YES | NULL | YES | Unique constraint |
| `stripe_customer_id` | varchar | YES | NULL | NO | |
| `user_id` | int (FK → users.id) | NO | — | NO | |
| `order_id` | int (FK → orders.id) | YES | NULL | NO | Nullable — some invoices have no order |
| `status` | varchar | YES | NULL | NO | String values: 'pending','created','finalized','paid','failed' |
| `hosted_invoice_url` | varchar | YES | NULL | NO | |
| `amount_due` | bigint | YES | NULL | NO | Stored as bigint |
| `currency` | varchar | YES | NULL | NO | |
| `created_at` | timestamp | NO | CURRENT_TIMESTAMP | NO | |
| `updated_at` | timestamp | NO | CURRENT_TIMESTAMP | NO | onUpdate: CURRENT_TIMESTAMP |

**Entity file:** `src/api/models/Invoices/Invoice.ts`

---

### 2.7 — `sales`

| Column | Type | Nullable | Default | Unique | Notes |
|--------|------|----------|---------|--------|-------|
| `id` | int (PK, auto-increment) | NO | — | YES | PrimaryGeneratedColumn('increment') |
| `order_id` | int (FK → orders.id) | NO | — | NO | |
| `user_id` | int (FK → users.id) | NO | — | NO | |
| `total_price` | decimal(8,2) | NO | 0 | NO | |
| `sold_at` | timestamp | NO | CURRENT_TIMESTAMP | NO | |

**Entity file:** `src/api/models/Sales/Sale.ts`

**Known issue:** The `order` relation is defined as `@OneToMany(() => Order, (order) => order.id)` which is incorrect. It should be `@ManyToOne`.

---

### 2.8 — `pricing` (Plans)

| Column | Type | Nullable | Default | Unique | Notes |
|--------|------|----------|---------|--------|-------|
| `id` | int (PK, auto-increment) | NO | — | YES | PrimaryGeneratedColumn('increment') |
| `plan_name` | varchar | NO | — | NO | |
| `plan_description` | varchar | NO | — | NO | |
| `price` | decimal(5,2) | NO | 0 | NO | |
| `billing_cycle` | varchar | NO | 'none' | NO | BillingCycle enum: 'none','monthly','yearly' |
| `created_at` | timestamp | NO | CURRENT_TIMESTAMP | NO | |
| `stripe_price_id` | varchar | YES | NULL | NO | |
| `stripe_product_id` | varchar | YES | NULL | NO | |

**Entity file:** `src/api/models/Plans/Plan.ts`

**Table name in DB:** `pricing` (not `plans`)

---

### 2.9 — `subscriptions`

| Column | Type | Nullable | Default | Unique | Notes |
|--------|------|----------|---------|--------|-------|
| `id` | int (PK, auto-increment) | NO | — | YES | PrimaryGeneratedColumn('increment') |
| `user_id` | int (FK → users.id) | NO | — | NO | |
| `plan_id` | int (FK → pricing.id) | NO | — | NO | |
| `stripe_subscription_id` | varchar(255) | NO | — | YES | Unique constraint |
| `status` | enum('incomplete','incomplete_expired','trialing','active','past_due','canceled','unpaid','paused') | NO | 'trialing' | NO | MySQL enum |
| `start_date` | timestamp | NO | — | NO | |
| `current_period_end` | timestamp | NO | — | NO | |
| `trial_ends_at` | timestamp | YES | NULL | NO | |
| `cancel_at_period_end` | boolean | NO | false | NO | |
| `created_at` | timestamp | NO | CURRENT_TIMESTAMP | NO | |
| `updated_at` | timestamp | NO | CURRENT_TIMESTAMP | NO | onUpdate: CURRENT_TIMESTAMP |

**Entity file:** `src/api/models/Subscriptions/UserSubscription.ts`

---

### 2.10 — `categories`

| Column | Type | Nullable | Default | Unique | Notes |
|--------|------|----------|---------|--------|-------|
| `id` | int (PK, auto-increment) | NO | — | YES | PrimaryGeneratedColumn('increment') |
| `category_name` | varchar | NO | — | NO | |
| `category_description` | varchar | NO | — | NO | |
| `created_at` | timestamp | NO | CURRENT_TIMESTAMP | NO | |

**Entity file:** `src/api/models/Categories/Category.ts`

---

### 2.11 — `favorites`

| Column | Type | Nullable | Default | Unique | Notes |
|--------|------|----------|---------|--------|-------|
| `id` | int (PK, auto-increment) | NO | — | YES | PrimaryGeneratedColumn('increment') |
| `user_id` | int (FK → users.id) | NO | — | NO | |
| `product_id` | int (FK → products.id) | NO | — | NO | onDelete: CASCADE |
| `created_at` | timestamp | NO | CURRENT_TIMESTAMP | NO | |

**Entity file:** `src/api/models/Favorites/Favorite.ts`

**Missing constraint:** No composite unique on (user_id, product_id). Duplicate prevention is handled only in application code.

---

### 2.12 — `product_images`

| Column | Type | Nullable | Default | Unique | Notes |
|--------|------|----------|---------|--------|-------|
| `id` | int (PK, auto-increment) | NO | — | YES | PrimaryGeneratedColumn('increment') |
| `image_url` | varchar | NO | — | NO | |
| `product_id` | int (FK → products.id) | NO | — | NO | onDelete: CASCADE |

**Entity file:** `src/api/models/ProductImages/ProductImage.ts`

**Note:** Entity defines `product_id` as a `Product` type (the entity), but the column name in the DB is `product_id`. The type annotation is misleading — it should be `number` for the column with a separate relation.

---

### 2.13 — `pendings`

| Column | Type | Nullable | Default | Unique | Notes |
|--------|------|----------|---------|--------|-------|
| `id` | int (PK, auto-increment) | NO | — | YES | PrimaryGeneratedColumn('increment') |
| `order_id` | int | NO | — | NO | **No foreign key defined in entity** |
| `user_id` | int (FK → users.id) | NO | — | NO | |
| `created_at` | timestamp | NO | CURRENT_TIMESTAMP | NO | |

**Entity file:** `src/api/models/Pendings/Pending.ts`

**Note:** The `order_id` column exists in the entity but has no `@ManyToOne` relation to Order. It's a raw integer column with no FK constraint enforced by the entity.

---

## 3. RELATIONSHIPS MAP

```
roles (1) ──────── (1) users
                        │
                        ├── (1) ──── (N) products          [via created_by]
                        ├── (1) ──── (N) orders            [via created_by]
                        ├── (1) ──── (N) sales             [via user_id]
                        ├── (1) ──── (N) invoices          [via user_id]
                        ├── (1) ──── (N) favorites         [via user_id]
                        ├── (1) ──── (N) pendings          [via user_id]
                        ├── (1) ──── (N) subscriptions     [via user_id]
                        └── (N) ──── (1) pricing           [via pricing_plan]

pricing (1) ────── (N) subscriptions
                        │
                        └── (1) ──── (N) users             [via pricing_plan]

categories (1) ─── (N) products          [via category_id]

products (1) ────── (N) order_items      [via product_id]
products (1) ────── (N) product_images   [via product_id]
products (1) ────── (N) favorites        [via product_id]

orders (1) ──────── (N) order_items      [via order_id]
orders (1) ──────── (N) invoices         [via order_id]
orders (1) ──────── (N) sales            [via order_id]  ← BROKEN RELATION

pendings.order_id — NO FK ENFORCED
```

### Relationship Details

| Parent | Child | FK Column | Relation Type | Cascade | On Delete |
|--------|-------|-----------|---------------|---------|-----------|
| roles | users | role_id | OneToOne | — | CASCADE (migration only) |
| users | products | created_by | ManyToOne | — | — |
| users | orders | created_by | ManyToOne | — | — |
| users | sales | user_id | ManyToOne | — | — |
| users | invoices | user_id | ManyToOne | — | — |
| users | favorites | user_id | ManyToOne | — | — |
| users | pendings | user_id | ManyToOne | — | — |
| users | subscriptions | user_id | ManyToOne | — | — |
| pricing | users | pricing_plan | ManyToOne | — | — |
| pricing | subscriptions | plan_id | ManyToOne | — | — |
| categories | products | category_id | ManyToOne | — | — |
| products | order_items | product_id | ManyToOne | CASCADE | CASCADE |
| products | product_images | product_id | ManyToOne | CASCADE | CASCADE |
| products | favorites | product_id | ManyToOne | CASCADE | CASCADE |
| orders | order_items | order_id | ManyToOne | CASCADE | CASCADE |
| orders | invoices | order_id | OneToMany | — | — |
| orders | sales | order_id | OneToMany (**WRONG**) | — | — |

---

## 4. MIGRATIONS

Only 2 migrations exist:

| Migration | File | Creates |
|-----------|------|---------|
| `1618771206804` | `CreateRolesTable.ts` | `roles` table (id, name) |
| `1618771301779` | `CreateUsersTable.ts` | `users` table (id, first_name, last_name, email, password, role_id) + FK to roles |

**Critical:** The actual database has 13 tables. The remaining 11 tables were created outside of migration history (likely via `synchronize: true` or manual SQL). This means the current schema cannot be reproduced from migrations alone.

---

## 5. SEEDS

| Seed | File | Behavior |
|------|------|----------|
| CreateRoles | `src/database/seeds/CreateRoles.ts` | Inserts roles: `{name: 'Admin'}, {name: 'Client'}` |
| CreateUsers | `src/database/seeds/CreateUsers.ts` | Creates 10 users via factory if user table is empty |

**Factory:** `src/database/factories/UserFactory.ts` — generates test users

---

## 6. ENUMS

### MySQL Enum: `products.status`

```sql
ENUM('pending', 'unavailable', 'available', 'sold')
```

TypeScript: `ProductStatus` in `src/api/models/Products/PEnum.ts`

### MySQL Enum: `subscriptions.status`

```sql
ENUM('incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused')
```

Inline TypeScript union type in entity.

### Application-level Enums (stored as varchar):

**`orders.status`** — `OrderStatus` in `src/api/models/Orders/OEnum.ts`:
```
pending, approved, confirmed, processing, shipped, delivered, cancelled, rejected, returned, refunded
```

**`pricing.billing_cycle`** — `BillingCycle` in `src/api/models/Plans/PEnum.ts`:
```
none, monthly, yearly
```

**`invoices.status`** — stored as plain string:
```
pending, created, finalized, paid, failed
```

---

## 7. API ENDPOINTS PER TABLE

### Auth (no table directly)

| Method | Route | Handler | Auth | Description |
|--------|-------|---------|------|-------------|
| POST | `/register` | RegisterController.register | No | Create user, return JWT |
| POST | `/login` | LoginController.login | No | Authenticate, return JWT |

### Users (`users`)

| Method | Route | Handler | Auth | Description |
|--------|-------|---------|------|-------------|
| GET | `/users` | UserController.getAll | Yes | List all users (with query options) |
| GET | `/users/:id` | UserController.getOne | Yes | Get user by ID (with plan relation) |
| GET | `/users/me` | UserController.getMe | Yes | Get logged-in user |
| GET | `/users/profile` | UserController.getProfile | Yes | Get profile (user + role) |
| GET | `/users/dashboard-stats` | UserController.getDashboardStats | Yes | Total users + user counters |
| GET | `/users/get-monthly-stats` | UserController.getMonthlyStats | Yes | Monthly sales/products/pendings |
| GET | `/users/:username` | UserController.getBySearch | Yes | Search users by name/email |
| POST | `/users` | UserController.create | Yes | Create user |
| PATCH | `/users/:id` | UserController.update | Yes | Update user |
| PUT | `/users/update-my-profile-picture` | UserController.updateMyProfilePicture | Yes | Upload profile photo (Cloudinary) |
| DELETE | `/users/:id` | UserController.delete | Yes (admin) | Delete user |

**Relations loaded:** role, pricing_plan, salesList, productsList, pendingsList

### Products (`products`)

| Method | Route | Handler | Auth | Description |
|--------|-------|---------|------|-------------|
| GET | `/products` | ProductController.getAll | Yes (Admin+) | List all products |
| GET | `/products/:id` | ProductController.getOne | Yes | Get product + images + category |
| GET | `/products/available-products` | ProductController.getAvailableProducts | Yes | Filter by status=available |
| GET | `/products/pending-products` | ProductController.getPendingProducts | Yes | Filter by status=pending |
| GET | `/products/unavailable-products` | ProductController.getUnavailableProducts | Yes | Filter by status=unavailable |
| GET | `/products/sold-products` | ProductController.getSoldProducts | Yes | Filter by status=sold |
| GET | `/products/my-products` | ProductController.getMyProducts | Yes | Current user's products |
| GET | `/products/:productName` | ProductController.getByProductName | Yes | Search by name (LIKE) |
| POST | `/products` | ProductController.create | Yes (Admin+) | Create product + Stripe + images |
| PUT | `/products/:id` | ProductController.update | Yes (Admin+) | Update product |
| PATCH | `/products/:id` | ProductController.updateStatus | Yes (Admin+) | Update status only |
| DELETE | `/products/:id` | ProductController.delete | Yes (Admin+) | Delete product |
| GET | `/products/images` | ProductController.getImages | Yes | All product images |
| GET | `/products/:id/images` | ProductController.getImagesByProductId | Yes | Images for a product |

**Relations loaded:** productImages, category, createdBy (User)

### Orders (`orders`)

| Method | Route | Handler | Auth | Description |
|--------|-------|---------|------|-------------|
| GET | `/orders` | OrderController.getAll | Yes | List all orders |
| GET | `/orders/:id` | OrderController.getOne | Yes | Get order by ID |
| POST | `/orders` | OrderController.create | Yes | Create checkout session (Stripe) |
| PUT | `/orders/:id` | OrderController.update | Yes | Update order |
| DELETE | `/orders/:id` | OrderController.delete | Yes | Delete order |

**Relations loaded:** orderItems, invoices, createdBy (User)

### Order Items (`order_items`)

| Method | Route | Handler | Auth | Description |
|--------|-------|---------|------|-------------|
| GET | `/orderitems` | OrderItemController.getAll | Yes | List all order items |
| GET | `/orderitems/:id` | OrderItemController.getOne | Yes | Get order item by ID |
| POST | `/orderitems` | OrderItemController.create | Yes | Create order item |
| PUT | `/orderitems/:id` | OrderItemController.update | Yes | Update order item |
| DELETE | `/orderitems/:id` | OrderItemController.delete | Yes | Delete order item |

### Invoices (`invoices`)

| Method | Route | Handler | Auth | Description |
|--------|-------|---------|------|-------------|
| GET | `/invoices` | InvoiceController.getAll | Yes | List all invoices |
| GET | `/invoices/:id` | InvoiceController.getOne | Yes | Get invoice by ID |
| POST | `/invoices` | InvoiceController.create | Yes | Create invoice |
| PUT | `/invoices/:id` | InvoiceController.update | Yes | Update invoice |
| DELETE | `/invoices/:id` | InvoiceController.delete | Yes | Delete invoice |
| GET | `/invoices/get-my-invoices` | InvoiceController.getMyInvoices | Yes | Current user's invoices (paginated) |

**Relations loaded:** order, orderItems, products, productImages (via QueryBuilder)

### Sales (`sales`)

| Method | Route | Handler | Auth | Description |
|--------|-------|---------|------|-------------|
| GET | `/sales` | SaleController.getAll | Yes | List all sales |
| GET | `/sales/:id` | SaleController.getOne | Yes | Get sale by ID |
| POST | `/sales` | SaleController.create | Yes | Create sale |
| PUT | `/sales/:id` | SaleController.update | Yes | Update sale |
| DELETE | `/sales/:id` | SaleController.delete | Yes | Delete sale |

### Favorites (`favorites`)

| Method | Route | Handler | Auth | Description |
|--------|-------|---------|------|-------------|
| GET | `/favorites` | FavoriteController.getAll | Yes | List all favorites |
| GET | `/favorites/:id` | FavoriteController.getOne | Yes | Get favorite by ID |
| POST | `/favorites` | FavoriteController.create | Yes | Add to favorites (checks duplicate) |
| PUT | `/favorites/:id` | FavoriteController.update | Yes | Update favorite |
| DELETE | `/favorites/:id` | FavoriteController.delete | Yes | Remove from favorites |
| GET | `/favorites/get-my-favorites` | FavoriteController.getMyFavorites | Yes | Current user's favorites (paginated) |

**Relations loaded:** product, productImages (via QueryBuilder)

### Categories (`categories`)

| Method | Route | Handler | Auth | Description |
|--------|-------|---------|------|-------------|
| GET | `/categories` | CategoryController.getAll | Yes | List all categories |
| GET | `/categories/:id` | CategoryController.getOne | Yes | Get category by ID |
| POST | `/categories` | CategoryController.create | Yes | Create category |
| PUT | `/categories/:id` | CategoryController.update | Yes (Admin+) | Update category |
| DELETE | `/categories/:id` | CategoryController.delete | Yes (Admin+) | Delete category |

### Pricing/Plans (`pricing`)

| Method | Route | Handler | Auth | Description |
|--------|-------|---------|------|-------------|
| GET | `/pricing` | PlanController.getAll | Yes | List all plans |
| GET | `/pricing/:id` | PlanController.getOne | Yes | Get plan by ID |
| POST | `/pricing` | PlanController.create | Yes | Create plan + Stripe product/price |
| POST | `/pricing/checkout-session` | PlanController.createCheckoutSession | Yes | Create Stripe checkout session |
| PUT | `/pricing/:id` | PlanController.update | Yes | Update plan |
| DELETE | `/pricing/:id` | PlanController.delete | Yes | Delete plan |
| GET | `/pricing/myPlan` | PlanController.getMyPlan | Yes | Current user's plan |

### Subscriptions (`subscriptions`)

| Method | Route | Handler | Auth | Description |
|--------|-------|---------|------|-------------|
| GET | `/user-subscription` | UserSubscriptionController.getAll | Yes | List all subscriptions |
| GET | `/user-subscription/:id` | UserSubscriptionController.getOne | Yes | Get subscription by ID |
| GET | `/user-subscription/my-subscription` | UserSubscriptionController.getMySubscription | Yes | Current user's subscription |
| POST | `/user-subscription` | UserSubscriptionController.create | Yes | Create subscription |
| DELETE | `/user-subscription/:id` | UserSubscriptionController.delete | Yes | Delete subscription |

### Pendings (`pendings`)

| Method | Route | Handler | Auth | Description |
|--------|-------|---------|------|-------------|
| GET | `/pendings` | PendingController.getAll | Yes | List pending orders (reads from orders table) |
| GET | `/pendings/:id` | PendingController.getOne | Yes | Get pending by ID |
| POST | `/pendings` | PendingController.create | Yes | Create pending |
| PUT | `/pendings/:id` | PendingController.update | Yes | Update pending |
| DELETE | `/pendings/:id` | PendingController.delete | Yes | Delete pending |
| GET | `/pendings/getMyPendings` | PendingController.getMyPendings | Yes | Current user's pending orders |

**Note:** `PendingService.getAll()` and `getMyPendings()` actually query the `orders` table (where status='pending'), not the `pendings` table. This is a semantic mismatch.

---

## 8. STRIPE WEBHOOK → DATABASE OPERATIONS

**Endpoint:** `POST /api/stripe/webhook`

### checkout.session.completed

**Subscription flow (planId in metadata):**
1. Find user by `metadata.userId`
2. Find plan by `metadata.planId`
3. Retrieve Stripe subscription
4. Insert/update `subscriptions` table
5. Update `users.pricing_plan` FK

**Order flow (orderId in metadata):**
1. Find user by `metadata.userId`
2. Find products by `metadata.productId` (comma-separated)
3. **TRANSACTION:**
   - Decrement product stock
   - Update product status (AVAILABLE → SOLD if stock=0)
   - Create `sales` records
   - Increment `users.sales` counter
   - Update `orders.status` to CONFIRMED
   - Generate invoice PDF
4. Update `invoices.status` to 'paid'
5. Update `invoices.stripe_invoice_id`
6. Update `orders.status` to APPROVED
7. Increment `users.orders` counter

### invoice.* events

1. Find invoice by `stripeInvoice.metadata.invoiceId`
2. Update `invoices.status` based on event type
3. Update `invoices.stripe_invoice_id` and `stripe_customer_id`

---

## 9. DENORMALIZED COUNTERS — WHERE THEY'RE USED

### `users.products`
- **Incremented in:** `ProductService.create()` → `user.products += 1`
- **Read in:** `UserService.dashboardStats()` → `user.products`
- **Computed value:** `SELECT COUNT(*) FROM products WHERE created_by = :userId`

### `users.orders`
- **Incremented in:** Stripe webhook (checkout.session.completed) → `user.orders = (user.orders ?? 0) + 1`
- **Read in:** `UserService.dashboardStats()` → `user.orders`
- **Computed value:** `SELECT COUNT(*) FROM orders WHERE created_by = :userId`

### `users.sales`
- **Incremented in:** Stripe webhook (checkout.session.completed) → `prodOwner.sales = (prodOwner.sales ?? 0) + 1`
- **Read in:** `UserService.dashboardStats()` → `user.sales`
- **Computed value:** `SELECT COUNT(*) FROM sales WHERE user_id = :userId`

### `users.favorites`
- **Incremented in:** `FavoriteService.create()` → `this.userRepository.update(favorite.user_id, { favorites: user.favorites + 1 })`
- **Read in:** `UserService.dashboardStats()` → `user.favorites`
- **Computed value:** `SELECT COUNT(*) FROM favorites WHERE user_id = :userId`

### `users.pendings`
- **Read in:** `UserService.dashboardStats()` → `user.pendings`
- **Not incremented anywhere in code** — appears unused

### `users.todos`
- **Not read or written anywhere in code** — appears unused

### `users.payments`
- **Not read or written anywhere in code** — appears unused

---

## 10. QUERIES OF CONCERN

### Search Queries (LIKE with leading wildcard)

```typescript
// UserService.getUsersBySearch()
`(${searchFields.map(f => `${f} LIKE :search`).join(' OR ')})`
// searchFields = ['first_name', 'last_name', 'email', 'role_name']
// searchValue = `%${search}%`

// ProductService.getProductsBySearch()
`(${searchFields.map(f => `${f} LIKE :search').join(' OR ')})`
// searchFields = ['product_name', 'product_description']
// searchValue = `%${search}%`
```

### Monthly Stats (loads all records into memory)

```typescript
// UserService.getMonthlyStats()
const user = await this.userRepository.findOne(id, {
  relations: ['salesList', 'productsList', 'pendingsList'],
});
// Then counts by month in JavaScript
```

### Favorites Creation (5 sequential queries)

```typescript
// FavoriteService.create()
1. findOne (check existing)
2. createFavorite
3. QueryBuilder (fetch user fields)
4. QueryBuilder (fetch product fields)
5. update (increment counter)
```

### Non-Atomic Order Creation

```typescript
// OrderService.createCheckoutSession()
1. createOrder
2. createOrderItem (loop — not wrapped in transaction)
3. stripe.customers.create (external API)
4. invoiceRepository.create + save
5. stripe.checkout.sessions.create (external API)
// If step 5 fails, orphaned order + items + invoice exist
```

---

## 11. ENVIRONMENT VARIABLES

| Variable | Used In | Purpose |
|----------|---------|---------|
| `TYPEORM_CONNECTION` | db.ts, docker-compose | Database driver |
| `TYPEORM_HOST` | db.ts | Database host |
| `TYPEORM_PORT` | db.ts | Database port |
| `TYPEORM_DATABASE` | db.ts, docker-compose | Database name |
| `TYPEORM_USERNAME` | db.ts, docker-compose | Database user |
| `TYPEORM_PASSWORD` | db.ts, docker-compose | Database password |
| `TYPEORM_ENTITIES` | db.ts | Entity file pattern |
| `TYPEORM_LOGGING` | db.ts | Enable query logging |
| `NODE_ENV` | app.ts | Environment mode |
| `PORT` / `APP_PORT` | app.ts | Server port |
| `JWT_SECRET` | auth.ts | JWT signing secret |
| `STRIPE_SECRET_KEY` | stripe.ts | Stripe API key |
| `STRIPE_WEBHOOK_SECRET` | main.ts | Stripe webhook verification |
| `CLOUDINARY_CLOUD_NAME` | cloudinary.ts | Cloudinary config |
| `CLOUDINARY_API_KEY` | cloudinary.ts | Cloudinary config |
| `CLOUDINARY_API_SECRET` | cloudinary.ts | Cloudinary config |

---

## 12. KNOWN ISSUES (DOCUMENTED, NOT YET FIXED)

1. **Migration history incomplete** — 13 tables exist, only 2 migrations
2. **MySQL enum columns** — `products.status`, `subscriptions.status` use MySQL-specific ENUM
3. **Broken Sale.order relation** — OneToMany should be ManyToOne
4. **Missing FK on pendings.order_id** — no FK enforced by entity
5. **Missing composite unique on favorites** — duplicate prevention is application-only
6. **Missing indexes** — no explicit indexes beyond PKs and unique constraints
7. **Denormalized counters** — 7 counter columns on users, 3 unused
8. **No pagination defaults** — most list endpoints return all records
9. **Hardcoded localhost URLs** — in Stripe checkout success/cancel URLs
10. **roles table column mismatch** — migration creates `name`, entity uses `role_name`
11. **PendingService reads from orders table** — semantic mismatch between table name and behavior
12. **No soft delete** — all deletes are hard deletes
13. **TypeORM 0.2 uses deprecated APIs** — createConnection, EntityRepository
14. **Non-atomic order creation** — order + items + invoice not in a single transaction
15. **ProductImages entity type mismatch** — `product_id` typed as `Product` entity instead of `number`

---

*This document was generated as part of Phase 1 of the V2 database architecture project.*
*Last updated: August 2026*
