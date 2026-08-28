# Vulum Database Issues — Phase 2 Classification

> Every identified issue is classified into one of three categories.
> Only Category A issues should be implemented independently.
> Category B and C issues require separate planning.

---

## CATEGORY A — Safe Independent Improvements

These can be implemented now, verified independently, and should not break existing behavior.

### A1. Missing Indexes

**Impact:** Query performance degrades as data grows.
**Risk:** Adding indexes is additive — never breaks reads. Minor write overhead.

```sql
-- Products
CREATE INDEX idx_products_created_by ON products(created_by);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);

-- Orders
CREATE INDEX idx_orders_created_by ON orders(created_by);
CREATE INDEX idx_orders_status ON orders(status);

-- Order Items
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Invoices
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_order_id ON invoices(order_id);

-- Sales
CREATE INDEX idx_sales_user_id ON sales(user_id);
CREATE INDEX idx_sales_order_id ON sales(order_id);

-- Favorites
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_product_id ON favorites(product_id);

-- Product Images
CREATE INDEX idx_product_images_product_id ON product_images(product_id);

-- Subscriptions
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);

-- Pendings
CREATE INDEX idx_pendings_user_id ON pendings(user_id);
```

**Migration needed:** Yes (new migration file)
**Reversible:** Yes (DROP INDEX)

---

### A2. Composite Unique Constraint on Favorites

**Impact:** Prevents duplicate favorites at database level.
**Risk:** Low — application already checks for duplicates, so no existing data should violate this.

```sql
ALTER TABLE favorites ADD UNIQUE INDEX uk_favorites_user_product (user_id, product_id);
```

**Migration needed:** Yes
**Reversible:** Yes

---

### A3. Fix Hardcoded Localhost URLs in Stripe Checkout

**Impact:** Checkout success/cancel URLs are hardcoded to `http://localhost:5173/dashboard`.
**Risk:** Low — only affects redirect behavior, not data.

Files to change:
- `src/api/services/Orders/OrderService.ts` — `success_url` and `cancel_url`
- `src/api/services/Plans/PlanService.ts` — `success_url` and `cancel_url`

Replace with environment variables:
```typescript
success_url: `${process.env.FRONTEND_URL}/dashboard`,
cancel_url: `${process.env.FRONTEND_URL}/cancel`,
```

**Migration needed:** No (code only)
**Reversible:** Yes

---

### A4. Enforce Default Pagination on List Endpoints

**Impact:** Prevents unbounded result sets.
**Risk:** Medium — frontend may depend on receiving all records. Must verify each endpoint.

Endpoints that currently return unlimited results:
- `GET /users` → `getAll()`
- `GET /products` → `getAll()`
- `GET /orders` → `getAll()`
- `GET /invoices` → `getAll()`
- `GET /sales` → `getAll()`
- `GET /favorites` → `getAll()`
- `GET /categories` → `getAll()`
- `GET /pricing` → `getAll()`
- `GET /user-subscription` → `getAll()`
- `GET /orderitems` → `getAll()`
- `GET /pendings` → `getAll()`
- `GET /products/images` → `getAll()`

**Recommendation:** Add default `take: 20, skip: 0` in the repository base or service layer. Only after verifying frontend handles pagination.

**Migration needed:** No (code only)
**Reversible:** Yes

---

### A5. Fix ProductImages Entity Type Mismatch

**Impact:** The `product_id` column is typed as `Product` entity instead of `number`.
**Risk:** Low — TypeORM handles this, but it's misleading and could cause issues with strict typing.

File: `src/api/models/ProductImages/ProductImage.ts`

```typescript
// CURRENT:
@Column()
product_id: Product;

// SHOULD BE:
@Column()
product_id: number;
```

The `@ManyToOne` relation already handles the Product entity. The column type should be `number`.

**Migration needed:** No (TypeORM entity only, column type in DB is already int)
**Reversible:** Yes

---

### A6. CORS Restriction for Production

**Impact:** `cors: { origin: '*' }` allows any origin.
**Risk:** Security concern in production.

File: `src/main.ts`

```typescript
// CURRENT:
cors({ origin: '*' })

// RECOMMENDED:
cors({ origin: process.env.FRONTEND_URL || '*' })
```

**Migration needed:** No (code only)
**Reversible:** Yes

---

## CATEGORY B — Migration-Related Changes

These are changes that relate to the MySQL → PostgreSQL migration. Do NOT implement until migration work begins.

### B1. MySQL ENUM Columns

**Tables affected:**
- `products.status` — ENUM('pending','unavailable','available','sold')
- `subscriptions.status` — ENUM('incomplete','incomplete_expired','trialing','active','past_due','canceled','unpaid','paused')

**PostgreSQL approach:** Use `text` column with CHECK constraint, or create PostgreSQL ENUM type.

```sql
-- PostgreSQL option 1: CHECK constraint (simpler)
ALTER TABLE products ADD CONSTRAINT chk_products_status 
  CHECK (status IN ('pending','unavailable','available','sold'));

-- PostgreSQL option 2: ENUM type (strict)
CREATE TYPE product_status AS ENUM ('pending','unavailable','available','sold');
```

**Depends on:** PostgreSQL migration phase

---

### B2. MySQL-Specific Default Values

**`onUpdate: 'CURRENT_TIMESTAMP'`** used in:
- `invoices.updated_at`
- `subscriptions.updated_at`

PostgreSQL does not support `ON UPDATE` defaults. Must use application-level or trigger.

**Depends on:** PostgreSQL migration phase

---

### B3. MySQL `bigint` vs PostgreSQL `bigint`/`serial`

The `users.id` is `bigint` with `auto-increment`. In PostgreSQL:
- `BIGSERIAL` or `GENERATED ALWAYS AS IDENTITY`
- Or keep `bigint` + sequence

**Depends on:** PostgreSQL migration phase

---

### B4. TypeORM Connection Configuration

Current: `TYPEORM_CONNECTION=mysql`
Target: `TYPEORM_CONNECTION=postgres`

Also need to change:
- `mysql2` → `pg` in package.json
- Docker image: `mysql:8.0` → `postgres:16`
- Port: 3306 → 5432

**Depends on:** PostgreSQL migration phase

---

### B5. Migration Syntax Differences

The 2 existing migrations use MySQL syntax. They need to be rewritten for PostgreSQL if we want reproducible schema.

**Depends on:** PostgreSQL migration phase

---

### B6. `varchar` Length Differences

MySQL enforces `varchar(n)` strictly. PostgreSQL is more lenient but still respects it.

Entities don't specify lengths (TypeORM defaults vary). Need to verify consistency.

**Depends on:** PostgreSQL migration phase

---

## CATEGORY C — High-Risk Architectural Changes

These require separate planning, testing, and potentially affect existing behavior.

### C1. Remove Denormalized Counter Columns from `users`

**Columns:** products, orders, sales, favorites, pendings, todos, payments

**Risk:** HIGH
- Frontend likely reads these for dashboard display
- Removing them changes API response structure
- Must replace with computed COUNT queries
- Must verify all read/write paths

**Current write paths:**
| Counter | Where incremented |
|---------|-------------------|
| products | `ProductService.create()` |
| orders | Stripe webhook |
| sales | Stripe webhook |
| favorites | `FavoriteService.create()` |
| pendings | Not incremented anywhere |
| todos | Not incremented anywhere |
| payments | Not incremented anywhere |

**Current read paths:**
| Counter | Where read |
|---------|-----------|
| products | `UserService.dashboardStats()` |
| orders | `UserService.dashboardStats()` |
| sales | `UserService.dashboardStats()` |
| favorites | `UserService.dashboardStats()` |
| pendings | `UserService.dashboardStats()` |
| todos | Not read anywhere |
| payments | Not read anywhere |

**Requires:** Frontend verification, API contract review, performance testing

---

### C2. Add Soft Delete

**Risk:** HIGH
- Changes deletion behavior for all entities
- Must add `deleted_at` column to relevant tables
- Must update all queries to filter out soft-deleted records
- Must update TypeORM entity configuration
- Affects all CRUD operations

**Depends on:** Business requirement analysis — does Vulum need account recovery, order history, audit trails?

---

### C3. Upgrade TypeORM from 0.2 to 0.3

**Risk:** HIGH
- `createConnection()` → `DataSource`
- `@EntityRepository()` → removed
- `getRepository()` / `getManager()` → different API
- `typeorm-typedi-extensions` → may need replacement
- Affects every repository, service, and controller

**Depends on:** Must be done carefully with full test coverage

---

### C4. Fix Non-Atomic Order Creation

**Risk:** MEDIUM-HIGH
- `OrderService.createCheckoutSession()` creates order, items, invoice without a single transaction
- If Stripe session creation fails, orphaned records exist
- Fixing this changes the order creation flow

**Current flow:**
```
1. createOrder
2. createOrderItem (loop)
3. stripe.customers.create
4. invoiceRepository.create + save
5. stripe.checkout.sessions.create
```

**Better flow:**
```
1. BEGIN TRANSACTION
2. createOrder
3. createOrderItem (loop)
4. COMMIT
5. stripe.customers.create
6. stripe.checkout.sessions.create
7. On success: create invoice
```

**Depends on:** Testing existing checkout flow thoroughly

---

### C5. Fix Sale.order Relationship

**Risk:** MEDIUM
- Currently `@OneToMany(() => Order, (order) => order.id)` which is incorrect
- Should be `@ManyToOne(() => Order, (order) => order.sales)`
- Changing this affects how TypeORM generates JOINs and loads relations
- Must verify no code depends on the current broken behavior

**Depends on:** Full relationship audit

---

### C6. Add Missing Foreign Key on `pendings.order_id`

**Risk:** MEDIUM
- Currently no FK constraint enforced by entity
- Adding FK requires all existing `order_id` values to reference valid orders
- Must check for orphaned records first

**Depends on:** Data integrity check on existing data

---

### C7. Add CHECK Constraints for Business Rules

**Risk:** LOW-MEDIUM
- `products.price >= 0`
- `products.stock >= 0`
- `order_items.quantity > 0`
- `order_items.total_amount >= 0`

Adding CHECK constraints prevents invalid data but may reject existing invalid data.

**Depends on:** Data audit to verify no invalid data exists

---

### C8. PendingService Semantic Mismatch

**Risk:** LOW-MEDIUM
- `PendingService.getAll()` queries `orders` table (status='pending')
- `PendingService.getMyPendings()` queries `orders` table
- But the entity is `pendings` table
- This is confusing but currently functional

**Decision needed:** Should pendings be a separate concept from pending orders? Or should the pendings table be removed entirely?

---

### C9. Add NOT NULL Constraints

**Risk:** LOW-MEDIUM
- Several columns that should be required are nullable
- Adding NOT NULL may reject existing NULL values
- Must audit existing data first

**Columns to audit:**
- `users.bio` — required by entity but may have NULLs in DB
- `users.first_name`, `users.last_name` — same
- `invoices.status` — currently nullable, should be required
- `invoices.amount_due` — financial data, should be required

**Depends on:** Data audit

---

## IMPLEMENTATION ORDER (RECOMMENDED)

### Immediately (Category A)
1. **A1** — Add indexes (migration, reversible, no behavior change)
2. **A2** — Add composite unique on favorites (migration, reversible)
3. **A5** — Fix ProductImages entity type (code only, no DB change)
4. **A3** — Fix hardcoded URLs (code only, env var)
5. **A6** — CORS restriction (code only)

### After frontend verification (Category A, medium risk)
6. **A4** — Default pagination (must verify frontend handles it)

### During PostgreSQL migration (Category B)
7. **B1–B6** — All migration-related changes

### Separate projects (Category C)
8. **C5** — Fix Sale.order relationship (independent fix)
9. **C4** — Fix non-atomic order creation (independent fix)
10. **C8** — Resolve PendingService semantic mismatch
11. **C1** — Remove denormalized counters (requires frontend work)
12. **C3** — Upgrade TypeORM (major refactor)
13. **C2** — Add soft delete (requires business decision)
14. **C6** — Add missing FK on pendings.order_id
15. **C7** — Add CHECK constraints
16. **C9** — Add NOT NULL constraints

---

*This document was generated as part of Phase 2 of the V2 database architecture project.*
*Last updated: August 2026*
