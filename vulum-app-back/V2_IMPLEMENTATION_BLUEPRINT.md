# V2 IMPLEMENTATION BLUEPRINT

> **Status:** Awaiting approval. No implementation code has been written.
> **Architecture:** Drizzle ORM + PostgreSQL + Express (plain routes)
> **Principle:** Preserve V1 API contracts. Improve internal architecture.

---

## 0. ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (React)                  │
│  Redux · Axios · Same API contracts as V1           │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP (same endpoints)
┌──────────────────────▼──────────────────────────────┐
│              Express Router (plain routes)           │
│  /api/auth  /api/users  /api/products  etc.         │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              Middleware Layer                         │
│  authenticate · requireRole · validate(schema)       │
│  errorHandler · requestLogger · cors · helmet        │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              Service Layer                           │
│  AuthService · UserService · ProductService · etc.   │
│  Pure business logic. No HTTP concerns.              │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              Database Layer (Drizzle ORM)            │
│  db.query.* · db.insert() · db.update() · db.select │
│  schemas in src/db/schema/                           │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              PostgreSQL                              │
│  Local dev · Neon · Supabase · any PG provider      │
└─────────────────────────────────────────────────────┘
```

---

## 1. TARGET FOLDER STRUCTURE

```
vulum-app-back/
├── src/
│   ├── db/
│   │   ├── schema/
│   │   │   ├── index.ts              # Re-exports all tables + relations
│   │   │   ├── users.ts
│   │   │   ├── roles.ts
│   │   │   ├── products.ts
│   │   │   ├── categories.ts
│   │   │   ├── orders.ts
│   │   │   ├── order-items.ts
│   │   │   ├── invoices.ts
│   │   │   ├── sales.ts
│   │   │   ├── plans.ts
│   │   │   ├── subscriptions.ts
│   │   │   ├── favorites.ts
│   │   │   ├── product-images.ts
│   │   │   └── pendings.ts
│   │   ├── migrations/               # Drizzle-generated SQL migrations
│   │   │   ├── 0000_initial.sql
│   │   │   └── ...
│   │   ├── client.ts                 # Drizzle client + pg Pool
│   │   ├── seed.ts                   # Database seeding
│   │   └── migrate.ts               # Migration runner
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.ts        # POST /login, POST /register
│   │   │   ├── auth.service.ts       # login, register logic
│   │   │   └── auth.types.ts         # JWT payload, auth response types
│   │   ├── users/
│   │   │   ├── users.routes.ts       # GET/POST/PATCH/DELETE /users
│   │   │   ├── users.service.ts      # CRUD, profile, search, stats
│   │   │   └── users.types.ts
│   │   ├── products/
│   │   │   ├── products.routes.ts    # GET/POST/PUT/PATCH/DELETE /products
│   │   │   ├── products.service.ts   # CRUD, search, images, Stripe
│   │   │   └── products.types.ts
│   │   ├── categories/
│   │   │   ├── categories.routes.ts
│   │   │   ├── categories.service.ts
│   │   │   └── categories.types.ts
│   │   ├── favorites/
│   │   │   ├── favorites.routes.ts
│   │   │   ├── favorites.service.ts
│   │   │   └── favorites.types.ts
│   │   ├── orders/
│   │   │   ├── orders.routes.ts
│   │   │   ├── orders.service.ts     # Checkout session, Stripe
│   │   │   └── orders.types.ts
│   │   ├── invoices/
│   │   │   ├── invoices.routes.ts
│   │   │   ├── invoices.service.ts
│   │   │   └── invoices.types.ts
│   │   ├── sales/
│   │   │   ├── sales.routes.ts
│   │   │   ├── sales.service.ts
│   │   │   └── sales.types.ts
│   │   ├── plans/
│   │   │   ├── plans.routes.ts       # /pricing endpoints
│   │   │   ├── plans.service.ts
│   │   │   └── plans.types.ts
│   │   ├── subscriptions/
│   │   │   ├── subscriptions.routes.ts
│   │   │   ├── subscriptions.service.ts
│   │   │   └── subscriptions.types.ts
│   │   ├── pendings/
│   │   │   ├── pendings.routes.ts
│   │   │   ├── pendings.service.ts
│   │   │   └── pendings.types.ts
│   │   └── webhooks/
│   │       ├── stripe.routes.ts      # POST /stripe/webhook
│   │       └── stripe.service.ts     # Webhook event handling
│   │
│   ├── shared/
│   │   ├── errors/
│   │   │   ├── AppError.ts           # Base error class
│   │   │   ├── NotFoundError.ts
│   │   │   ├── UnauthorizedError.ts
│   │   │   ├── ForbiddenError.ts
│   │   │   ├── ConflictError.ts
│   │   │   ├── BadRequestError.ts
│   │   │   └── errorHandler.ts       # Express error middleware
│   │   ├── validation/
│   │   │   ├── schemas.ts            # All Zod schemas
│   │   │   └── validate.ts           # Express validation middleware
│   │   ├── middleware/
│   │   │   ├── authenticate.ts       # JWT verification
│   │   │   ├── requireRole.ts        # Role-based access
│   │   │   ├── requestLogger.ts      # Request logging
│   │   │   └── upload.ts            # Multer config
│   │   ├── utils/
│   │   │   ├── env.ts
│   │   │   ├── hash.ts              # bcrypt wrapper
│   │   │   ├── jwt.ts               # JWT sign/verify
│   │   │   ├── cloudinary.ts        # Upload helper
│   │   │   └── pdf.ts               # PDF generation
│   │   └── types/
│   │       └── index.ts             # Shared types (LoggedUser, etc.)
│   │
│   ├── config/
│   │   ├── app.ts
│   │   ├── auth.ts
│   │   ├── database.ts
│   │   └── stripe.ts
│   │
│   ├── app.ts                       # Express app setup
│   └── server.ts                    # Entry point (DB connect + listen)
│
├── drizzle.config.ts
├── package.json
├── tsconfig.json
├── .env.example
└── docker-compose.yml
```

**What changes:**
- Entities → Drizzle schema files
- Repositories → Services use Drizzle client directly
- Controllers → Route handlers (plain Express functions)
- typeorm-typedi-extensions → Not needed
- typeorm-simple-query-parser → Replaced by Zod query validation
- routing-controllers → Plain Express Router
- class-validator → Zod

**What stays the same:**
- Module directory structure (users, products, orders, etc.)
- Stripe integration
- Cloudinary integration
- JWT authentication flow
- Express as the HTTP framework

---

## 2. POSTGRESQL SCHEMA DESIGN

### 2.1 Users

**Current MySQL:**
```sql
users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(191) UNIQUE NOT NULL,
  email VARCHAR(191) UNIQUE NOT NULL,
  password VARCHAR(191) NOT NULL,
  first_name VARCHAR(191) NOT NULL,
  last_name VARCHAR(191) NOT NULL,
  bio VARCHAR(191),
  phone VARCHAR(191),
  address VARCHAR(191),
  profile_photo_url VARCHAR(191),
  role_id BIGINT DEFAULT 5,
  pricing_plan BIGINT,
  stripe_customer_id VARCHAR(255),
  products INT DEFAULT 0,      -- REMOVE (denormalized counter)
  orders INT DEFAULT 0,        -- REMOVE
  sales INT DEFAULT 0,         -- REMOVE
  favorites INT DEFAULT 0,     -- REMOVE
  pendings INT DEFAULT 0,      -- REMOVE
  todos INT DEFAULT 0,         -- REMOVE
  payments INT DEFAULT 0,      -- REMOVE
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (pricing_plan) REFERENCES pricing(id)
)
```

**Target PostgreSQL:**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(191) UNIQUE NOT NULL,
  email VARCHAR(191) UNIQUE NOT NULL,
  password VARCHAR(191) NOT NULL,
  first_name VARCHAR(191) NOT NULL,
  last_name VARCHAR(191) NOT NULL,
  bio TEXT,
  phone VARCHAR(20),
  address TEXT,
  profile_photo_url TEXT,
  role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL DEFAULT 5,
  pricing_plan_id INTEGER REFERENCES plans(id) ON DELETE SET NULL,
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

**Changes:**
- Remove 7 denormalized counter columns (`products`, `orders`, `sales`, `favorites`, `pendings`, `todos`, `payments`)
- Rename `pricing_plan` → `pricing_plan_id` (clearer naming)
- `id` → SERIAL (PostgreSQL auto-increment)
- `bio`/`address` → TEXT (more flexible than VARCHAR)
- `phone` → VARCHAR(20) (standard phone length)
- Add `ON DELETE SET NULL` on foreign keys
- Add explicit `updated_at` column (MySQL had implicit via `ON UPDATE`)

**Critical:** Frontend depends on counter fields (`user.products`, `user.orders`, etc.). We must compute these on-the-fly in the service layer and return them in the same response shape.

---

### 2.2 Roles

**Target PostgreSQL:**
```sql
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

**Note:** Migration creates `name` but entity uses `role_name`. Target standardizes on `name`.

---

### 2.3 Products

**Target PostgreSQL:**
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  product_description TEXT NOT NULL,
  price DECIMAL(8,2) NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 1,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('available', 'pending', 'unavailable', 'sold')),
  stripe_price_id VARCHAR(255),
  stripe_product_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

**Changes:**
- `status` → VARCHAR with CHECK constraint (more portable than PostgreSQL native enum)
- Add `updated_at`
- `DECIMAL(8,2)` for money (preserved)
- `ON DELETE RESTRICT` on category (prevent deleting category with products)
- `ON DELETE CASCADE` on user (if user deleted, products go)

---

### 2.4 Categories

**Target PostgreSQL:**
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  category_name VARCHAR(255) NOT NULL,
  category_description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

---

### 2.5 Orders

**Target PostgreSQL:**
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

**Changes:**
- `amount` → DECIMAL(10,2) (wider for larger orders)
- Add `updated_at`
- `status` as VARCHAR (preserving current behavior — not using enum type)

---

### 2.6 Order Items

**Target PostgreSQL:**
```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

---

### 2.7 Invoices

**Target PostgreSQL:**
```sql
CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  stripe_invoice_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'pending',
  hosted_invoice_url TEXT,
  amount_due DECIMAL(12,2),
  currency VARCHAR(10) DEFAULT 'usd',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

**Critical changes:**
- `amount_due` → DECIMAL(12,2) (was BIGINT — wrong type for money!)
- `order_id` → nullable with FK (was broken before)
- `stripe_invoice_id` → UNIQUE
- Add `updated_at`

---

### 2.8 Sales

**Target PostgreSQL:**
```sql
CREATE TABLE sales (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  sold_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

**Critical fix:** `order_id` now has a proper foreign key. Current V1 has `@OneToMany` to Order which should be `@ManyToOne`.

---

### 2.9 Plans (Pricing)

**Target PostgreSQL:**
```sql
CREATE TABLE plans (
  id SERIAL PRIMARY KEY,
  plan_name VARCHAR(255) NOT NULL,
  plan_description TEXT NOT NULL,
  price DECIMAL(8,2) NOT NULL DEFAULT 0,
  billing_cycle VARCHAR(20) NOT NULL DEFAULT 'none'
    CHECK (billing_cycle IN ('none', 'monthly', 'yearly')),
  stripe_price_id VARCHAR(255),
  stripe_product_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

**Changes:**
- Table renamed from `pricing` → `plans` (cleaner name)
- `billing_cycle` → VARCHAR with CHECK (more portable)
- FK references throughout must update from `pricing` → `plans`

---

### 2.10 Subscriptions

**Target PostgreSQL:**
```sql
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id INTEGER NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'trialing'
    CHECK (status IN (
      'incomplete', 'incomplete_expired', 'trialing',
      'active', 'past_due', 'canceled', 'unpaid', 'paused'
    )),
  start_date TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  trial_ends_at TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

**Changes:**
- `status` → VARCHAR with CHECK (portable)
- `plan_id` references `plans` (was `pricing`)

---

### 2.11 Favorites

**Target PostgreSQL:**
```sql
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, product_id)
);
```

**Changes:**
- Composite unique constraint `(user_id, product_id)` added
- `ON DELETE CASCADE` on both FKs

---

### 2.12 Product Images

**Target PostgreSQL:**
```sql
CREATE TABLE product_images (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

**Changes:**
- `product_id` → INTEGER (was typed as Product entity in V1 — bug)
- Add `created_at`

---

### 2.13 Pendings

**Target PostgreSQL:**
```sql
CREATE TABLE pendings (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

**Changes:**
- `order_id` → now has proper FK to `orders(id)` (was missing in V1)

---

## 3. DRIZZLE SCHEMA DEFINITIONS

All schemas use `drizzle-orm/pg-core`. Example pattern:

```typescript
// src/db/schema/users.ts
import { pgTable, serial, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { roles } from './roles';
import { plans } from './plans';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 191 }).unique().notNull(),
  email: varchar('email', { length: 191 }).unique().notNull(),
  password: varchar('password', { length: 191 }).notNull(),
  firstName: varchar('first_name', { length: 191 }).notNull(),
  lastName: varchar('last_name', { length: 191 }).notNull(),
  bio: text('bio'),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  profilePhotoUrl: text('profile_photo_url'),
  roleId: integer('role_id').references(() => roles.id, { onDelete: 'set null' }).default(5),
  pricingPlanId: integer('pricing_plan_id').references(() => plans.id, { onDelete: 'set null' }),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, { fields: [users.roleId], references: [roles.id] }),
  pricingPlan: one(plans, { fields: [users.pricingPlanId], references: [plans.id] }),
  products: many(products),
  orders: many(orders),
  favorites: many(favorites),
  invoices: many(invoices),
  subscriptions: many(subscriptions),
  pendings: many(pendings),
}));
```

> **Important:** Drizzle uses camelCase for TypeScript properties (e.g., `firstName`) but snake_case for database columns (e.g., `first_name`). The `column()` parameter maps between them.

### Complete Drizzle Schema Files

See `src/db/schema/` directory. Each file follows the same pattern:
1. Import table-building functions from `drizzle-orm/pg-core`
2. Define the table with proper types
3. Define relations with `relations()`
4. Export both table and relations

### Schema Design Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Table naming | snake_case | Matches existing database |
| Column naming | snake_case in DB, camelCase in TS | Drizzle convention |
| Status fields | VARCHAR + CHECK | More portable than native enums |
| Monetary values | DECIMAL(P,S) | Accurate, no floating point |
| Timestamps | TIMESTAMP DEFAULT NOW() | PostgreSQL standard |
| IDs | SERIAL | Simple auto-increment |
| FKs | Explicit REFERENCES | Referential integrity |

---

## 4. RELATIONSHIP DESIGN

```
roles ────────────< users
plans ────────────< users (pricing_plan_id)
users ────────────< products (created_by)
users ────────────< orders (created_by)
users ────────────< favorites (user_id)
users ────────────< invoices (user_id)
users ────────────< sales (user_id)
users ────────────< subscriptions (user_id)
users ────────────< pendings (user_id)
categories ───────< products (category_id)
products ─────────< order_items (product_id)
products ─────────< favorites (product_id)
products ─────────< product_images (product_id)
orders ───────────< order_items (order_id)
orders ───────────< invoices (order_id)
orders ───────────< sales (order_id)
plans ────────────< subscriptions (plan_id)
```

### Relationship Summary

| Parent | Child | FK Column | On Delete | Type |
|--------|-------|-----------|-----------|------|
| roles | users | role_id | SET NULL | one-to-many |
| plans | users | pricing_plan_id | SET NULL | one-to-many |
| users | products | created_by | CASCADE | one-to-many |
| users | orders | created_by | CASCADE | one-to-many |
| users | favorites | user_id | CASCADE | one-to-many |
| users | invoices | user_id | CASCADE | one-to-many |
| users | sales | user_id | CASCADE | one-to-many |
| users | subscriptions | user_id | CASCADE | one-to-many |
| users | pendings | user_id | CASCADE | one-to-many |
| categories | products | category_id | RESTRICT | one-to-many |
| products | order_items | product_id | CASCADE | one-to-many |
| products | favorites | product_id | CASCADE | one-to-many |
| products | product_images | product_id | CASCADE | one-to-many |
| orders | order_items | order_id | CASCADE | one-to-many |
| orders | invoices | order_id | SET NULL | one-to-many |
| orders | sales | order_id | CASCADE | one-to-many |
| plans | subscriptions | plan_id | CASCADE | one-to-many |

---

## 5. INDEX STRATEGY

### 5.1 Indexes to Create

| Table | Index | Column(s) | Type | Reason |
|-------|-------|-----------|------|--------|
| products | `idx_products_created_by` | created_by | B-tree | "My products" query |
| products | `idx_products_category_id` | category_id | B-tree | Filter by category |
| products | `idx_products_status` | status | B-tree | Filter by status |
| products | `idx_products_created_at` | created_at DESC | B-tree | Sort by newest |
| orders | `idx_orders_created_by` | created_by | B-tree | "My orders" query |
| orders | `idx_orders_status` | status | B-tree | Filter by status |
| orders | `idx_orders_created_at` | created_at DESC | B-tree | Sort by newest |
| order_items | `idx_order_items_order_id` | order_id | B-tree | Join with orders |
| order_items | `idx_order_items_product_id` | product_id | B-tree | Join with products |
| invoices | `idx_invoices_user_id` | user_id | B-tree | "My invoices" query |
| invoices | `idx_invoices_order_id` | order_id | B-tree | Join with orders |
| invoices | `idx_invoices_status` | status | B-tree | Filter by status |
| sales | `idx_sales_user_id` | user_id | B-tree | "My sales" query |
| sales | `idx_sales_order_id` | order_id | B-tree | Join with orders |
| favorites | `idx_favorites_user_id` | user_id | B-tree | "My favorites" query |
| favorites | `idx_favorites_product_id` | product_id | B-tree | Join with products |
| product_images | `idx_product_images_product_id` | product_id | B-tree | Join with products |
| subscriptions | `idx_subscriptions_user_id` | user_id | B-tree | "My subscriptions" |
| subscriptions | `idx_subscriptions_status` | status | B-tree | Filter by status |
| pendings | `idx_pendings_user_id` | user_id | B-tree | "My pendings" query |

### 5.2 Unique Constraints

| Table | Constraint | Column(s) | Purpose |
|-------|-----------|-----------|---------|
| users | `uk_users_username` | username | Prevent duplicate usernames |
| users | `uk_users_email` | email | Prevent duplicate emails |
| favorites | `uk_favorites_user_product` | (user_id, product_id) | Prevent duplicate favorites |
| subscriptions | `uk_subscriptions_stripe_id` | stripe_subscription_id | Stripe ID uniqueness |
| invoices | `uk_invoices_stripe_id` | stripe_invoice_id | Stripe ID uniqueness |

### 5.3 Index Naming Convention

```
idx_{table}_{column}
uk_{table}_{columns}
```

---

## 6. CONSTRAINT STRATEGY

### 6.1 Database-Level Constraints

| Constraint | Table | Columns | Type |
|-----------|-------|---------|------|
| Primary keys | all | id | SERIAL PK |
| Unique | users | username | UNIQUE |
| Unique | users | email | UNIQUE |
| Unique | favorites | (user_id, product_id) | COMPOSITE UNIQUE |
| Unique | subscriptions | stripe_subscription_id | UNIQUE |
| Unique | invoices | stripe_invoice_id | UNIQUE |
| FK → roles | users | role_id | REFERENCES |
| FK → plans | users | pricing_plan_id | REFERENCES |
| FK → categories | products | category_id | REFERENCES |
| FK → users | products | created_by | REFERENCES |
| FK → users | orders | created_by | REFERENCES |
| FK → orders | order_items | order_id | REFERENCES |
| FK → products | order_items | product_id | REFERENCES |
| FK → users | invoices | user_id | REFERENCES |
| FK → orders | invoices | order_id | REFERENCES |
| FK → users | sales | user_id | REFERENCES |
| FK → orders | sales | order_id | REFERENCES |
| FK → users | favorites | user_id | REFERENCES |
| FK → products | favorites | product_id | REFERENCES |
| FK → products | product_images | product_id | REFERENCES |
| FK → users | subscriptions | user_id | REFERENCES |
| FK → plans | subscriptions | plan_id | REFERENCES |
| FK → users | pendings | user_id | REFERENCES |
| FK → orders | pendings | order_id | REFERENCES |
| CHECK | products | status IN (...) | CHECK |
| CHECK | plans | billing_cycle IN (...) | CHECK |
| CHECK | subscriptions | status IN (...) | CHECK |
| NOT NULL | all required fields | various | NOT NULL |
| DEFAULT | various | various | DEFAULT |

### 6.2 Validation Strategy

Application-level validation via Zod (see Section 11) provides the first line of defense. Database constraints provide the safety net.

---

## 7. MIGRATION STRATEGY

### 7.1 MySQL → PostgreSQL Migration Process

```
Step 1: Export from MySQL
  ├── pg_dump not applicable (different engines)
  ├── Use custom export script or mysql2 → pg copy
  └── Table-by-table data export

Step 2: Transform
  ├── Convert MySQL types to PostgreSQL types
  ├── Handle ENUM → VARCHAR + CHECK
  ├── Handle auto-increment → SERIAL
  ├── Handle timestamps
  └── Handle boolean values (0/1 → false/true)

Step 3: Import to PostgreSQL
  ├── Create tables via Drizzle migrations
  ├── Import data via COPY or INSERT
  └── Verify row counts

Step 4: Verify
  ├── Row count comparison per table
  ├── FK relationship verification
  ├── Unique constraint verification
  └── Sample data spot-check
```

### 7.2 Migration Script Design

```typescript
// scripts/migrate-mysql-to-pg.ts
// 1. Connect to MySQL (source)
// 2. Connect to PostgreSQL (target)
// 3. For each table:
//    a. Read all rows from MySQL
//    b. Transform data types
//    c. Insert into PostgreSQL
//    d. Verify count
// 4. Compare totals
// 5. Report success/failure
```

### 7.3 Data Transformation Requirements

| MySQL Type | PostgreSQL Type | Transformation |
|-----------|----------------|----------------|
| `BIGINT AUTO_INCREMENT` | `SERIAL` | IDENTITY mapping |
| `INT AUTO_INCREMENT` | `SERIAL` | IDENTITY mapping |
| `VARCHAR(N)` | `VARCHAR(N)` | Direct copy |
| `TEXT` | `TEXT` | Direct copy |
| `DECIMAL(P,S)` | `DECIMAL(P,S)` | Direct copy |
| `TIMESTAMP` | `TIMESTAMP` | Direct copy |
| `ENUM('a','b')` | `VARCHAR` | Direct copy (values are strings) |
| `BOOLEAN TINYINT(1)` | `BOOLEAN` | Convert 0/1 → false/true |
| `BIGINT` (amount_due) | `DECIMAL(12,2)` | Cast/convert — critical fix |
| `DEFAULT 0` (counters) | REMOVE | Columns don't exist in target |

---

## 8. TRANSACTION STRATEGY

### 8.1 Operations Requiring Transactions

| Operation | Tables Involved | Reason |
|-----------|----------------|--------|
| Create order + order items + invoice | orders, order_items, invoices | Atomicity — all or nothing |
| Process checkout (webhook) | products, sales, orders, users, invoices | Stock update + sale creation + status update must be atomic |
| Delete product + images + favorites | products, product_images, favorites | Cascade handles most, but explicit tx for safety |
| Subscription creation + user update | subscriptions, users | Link plan to user atomically |

### 8.2 Drizzle Transaction Pattern

```typescript
import { db } from '../db/client';

// In service:
await db.transaction(async (tx) => {
  const [order] = await tx.insert(orders).values({...}).returning();
  await tx.insert(orderItems).values(items.map(i => ({ ...i, orderId: order.id })));
  await tx.insert(invoices).values({ ... });
});
```

### 8.3 What Does NOT Need Transactions

- Single-table CRUD (creates, updates, deletes)
- Reads (unless reading within a transaction for consistency)
- Stripe API calls (external — handle idempotently)
- File uploads (Cloudinary — external)

---

## 9. AUTHENTICATION ARCHITECTURE

### 9.1 JWT Flow (Same as V1)

```
Registration:
  1. Validate input (Zod)
  2. Check email uniqueness
  3. Hash password (bcrypt)
  4. Insert user
  5. Sign JWT with { userId, email, role_id, role }
  6. Return { access_token, user: { id, email, role }, expires_in }

Login:
  1. Validate input (Zod)
  2. Find user by email
  3. Compare password (bcrypt)
  4. Sign JWT
  5. Return { access_token, user: { id, email, role }, expires_in }
```

### 9.2 JWT Payload

```typescript
interface JwtPayload {
  userId: number;
  email: string;
  role_id: number;
  role: string;     // "Admin", "Client", etc.
  iat: number;
  exp: number;
}
```

### 9.3 Auth Middleware

```typescript
// src/shared/middleware/authenticate.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig } from '../../config/auth';
import { UnauthorizedError } from '../errors/UnauthorizedError';

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return next(new UnauthorizedError('No token provided'));

  try {
    const decoded = jwt.verify(token, authConfig.jwt.secret) as JwtPayload;
    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired token'));
  }
}
```

### 9.4 What Stays the Same

- JWT signing/verification
- Password hashing (bcrypt)
- Token stored in localStorage (frontend)
- Authorization header format: `Bearer <token>`
- Role-based access control

### 9.5 What Gets Improved

- Proper error classes (not generic `Error`)
- Consistent 401/403 responses
- Type-safe request object (`AuthenticatedRequest`)

### 9.6 What Could Break

- If JWT secret changes → all existing tokens invalid
- If payload shape changes → frontend JWT decode breaks
- **Mitigation:** Keep JWT payload identical to V1

---

## 10. FRONTEND COMPATIBILITY STRATEGY

### 10.1 API Contract Map

Every endpoint the frontend calls, with expected response shape:

#### Auth

| Method | Endpoint | Request | Response | Frontend File |
|--------|----------|---------|----------|---------------|
| POST | `/api/login` | `{ email, password }` | `{ access_token, user: { id, email, role }, expires_in }` | SignInPage |
| POST | `/api/register` | `{ username, first_name, last_name, email, password }` | `{ access_token, user: { id, email, role }, expires_in }` | SignUpPage |

#### Users

| Method | Endpoint | Response Shape | Frontend File |
|--------|----------|----------------|---------------|
| GET | `/api/users/dashboard-stats` | `{ totalUsers, user: { id, sales, products, orders, favorites, pendings, first_name, last_name } }` | useDashboardData |
| GET | `/api/users/get-monthly-stats` | `[{ month, monthName, sales, products, pendings }]` | useDashboardData |
| GET | `/api/users/profile` | `{ id, first_name, last_name, profile_photo_url, role_name }` | getPfpHook |
| GET | `/api/users/me` | Full user object with role and plan | — |
| GET | `/api/users/:username` | Array of user objects | — |
| PATCH | `/api/users/:id` | Updated user object | UserUpdateForm |
| PUT | `/api/users/update-my-profile-picture` | Updated user object | — |

**Critical:** `dashboard-stats` returns `user.sales`, `user.products`, `user.orders`, `user.favorites`, `user.pendings` — these were counter columns. In V2, we compute these via COUNT queries and return in the same shape.

#### Products

| Method | Endpoint | Response Shape | Frontend File |
|--------|----------|----------------|---------------|
| GET | `/api/products/available-products` | `ProductInterface[]` | getAllProductsHook |
| GET | `/api/products/my-products` | `ProductInterface[]` | getMyProductsHook |
| GET | `/api/products/pending-products` | `ProductInterface[]` | getAllPendingProducts |
| GET | `/api/products/:id` | `ProductInterface` | getProduct |
| POST | `/api/products` | `{ product: ProductInterface, images: ImageInterface[] }` | — |
| PUT | `/api/products/:id` | Updated product | — |
| PATCH | `/api/products/:id` | `{ message: string }` | — |

**ProductInterface:**
```typescript
{
  id: number;
  category: number;        // category_id
  created_at: string;
  created_by: number;
  price: number;
  product_description: string;
  product_name: string;
  status: string;
  stock: number;
  stripe_price_id: string;
  stripe_product_id: string;
  productImages: { id: number; image_url: string }[];
}
```

#### Favorites

| Method | Endpoint | Response Shape | Frontend File |
|--------|----------|----------------|---------------|
| GET | `/api/favorites/get-my-favorites` | `{ items: ProductInterface[], total, page, totalPages }` | getMyFavoritesHook |
| POST | `/api/favorites` | Favorite object | — |
| DELETE | `/api/favorites/:id` | — (204) | — |

#### Invoices

| Method | Endpoint | Response Shape | Frontend File |
|--------|----------|----------------|---------------|
| GET | `/api/invoices/get-my-invoices` | `{ items: InvoiceInterface[], total, page, totalPages }` | getMyInvoices |

**InvoiceInterface:**
```typescript
{
  id: number;
  stripe_invoice_id: string | null;
  stripe_customer_id: string | null;
  status: string;
  amount_due: number;
  currency: string;
  order: {
    id: number;
    name: string;
    amount: string;
    status: string;
    orderItems: [{
      id: number;
      quantity: number;
      totalAmount: string;
      productsList: {
        id: number;
        name: string;
        description: string;
        price: string;
        productImages: { id: number; image_url: string }[];
      }
    }]
  }
}
```

#### Orders

| Method | Endpoint | Response Shape | Frontend File |
|--------|----------|----------------|---------------|
| POST | `/api/orders` | `{ url: string, invoiceId: number }` | orderProduct |

#### Plans/Pricing

| Method | Endpoint | Response Shape | Frontend File |
|--------|----------|----------------|---------------|
| GET | `/api/pricing` | `{ rows: PlanInterface[], count: number }` | getPricingPlans |
| POST | `/api/pricing/checkout-session` | `{ url: string }` | subscribePlanHook |
| GET | `/api/pricing/myPlan` | Plan object or null | — |

### 10.2 Breaking Changes to Avoid

| Change | Risk | Decision |
|--------|------|----------|
| Rename `/api/pricing` → `/api/plans` | HIGH — frontend depends on this route | Keep `/api/pricing` |
| Rename `pricing_plan` → `pricing_plan_id` in user response | HIGH — frontend reads this field | Compute `pricing_plan` relation in response |
| Remove counter fields from user response | HIGH — frontend reads `user.products`, etc. | Compute via COUNT and return in same shape |
| Change auth response shape | HIGH — Redux depends on `access_token`, `user.id`, etc. | Keep identical |
| Change product response shape | HIGH — Redux + components depend on field names | Keep identical |
| Rename `role_name` → `name` | MEDIUM — frontend reads `role.role_name` | Map `name` → `role_name` in response |

### 10.3 Compatibility Layer

For any internal naming differences between V2 schema and V1 API responses, use a mapping layer in the service:

```typescript
// In users.service.ts
async getDashboardStats(userId: number) {
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  const [productCount] = await db.select({ count: count() }).from(products).where(eq(products.createdBy, userId));
  const [orderCount] = await db.select({ count: count() }).from(orders).where(eq(orders.createdBy, userId));
  const [salesCount] = await db.select({ count: count() }).from(sales).where(eq(sales.userId, userId));
  const [favoritesCount] = await db.select({ count: count() }).from(favorites).where(eq(favorites.userId, userId));
  const [pendingsCount] = await db.select({ count: count() }).from(pendings).where(eq(pendings.userId, userId));

  return {
    totalUsers: await db.select({ count: count() }).from(users).then(r => r[0].count),
    user: {
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      sales: salesCount.count,
      products: productCount.count,
      orders: orderCount.count,
      favorites: favoritesCount.count,
      pendings: pendingsCount.count,
    }
  };
}
```

---

## 11. VALIDATION ARCHITECTURE WITH ZOD

### 11.1 Validation Middleware

```typescript
// src/shared/validation/validate.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { BadRequestError } from '../errors/BadRequestError';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return next(new BadRequestError('Validation failed', errors));
    }
    req.body = result.data;
    next();
  };
}
```

### 11.2 Zod Schemas (All Validation)

```typescript
// src/shared/validation/schemas.ts
import { z } from 'zod';

// Auth
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const registerSchema = z.object({
  username: z.string().min(2).max(20),
  first_name: z.string().min(2).max(20),
  last_name: z.string().min(2).max(20),
  email: z.string().email(),
  password: z.string().min(6),
});

// Users
export const userUpdateSchema = z.object({
  username: z.string().min(2).max(20).optional(),
  first_name: z.string().min(2).max(20).optional(),
  last_name: z.string().min(2).max(20).optional(),
  phone: z.string().min(9).optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
});

// Products
export const productCreateSchema = z.object({
  product_name: z.string().min(1),
  product_description: z.string().min(1),
  price: z.number().positive(),
  stock: z.number().int().positive(),
  category_id: z.number().int().positive(),
});

export const createProductWithImagesSchema = z.object({
  product: productCreateSchema,
  images: z.array(z.object({
    image_url: z.string().url(),
  })).min(1),
});

// Orders
export const orderCreateSchema = z.object({
  items: z.array(z.object({
    product_id: z.number().int().positive(),
    quantity: z.number().int().positive(),
  })).min(1),
});

// Favorites
export const favoriteCreateSchema = z.object({
  product_id: z.number().int().positive(),
});

// Plans
export const planCreateSchema = z.object({
  plan_name: z.string().min(1),
  plan_description: z.string().min(1),
  price: z.number().positive(),
  billing_cycle: z.enum(['none', 'monthly', 'yearly']),
});

// Categories
export const categoryCreateSchema = z.object({
  category_name: z.string().min(2),
  category_description: z.string().min(2),
});
```

### 11.3 What Changes

- class-validator decorators → Zod schemas (separate from entity definitions)
- Validation errors → consistent `{ success: false, error: { code, message, details } }`
- Request type inference from Zod schema (no separate interface needed)

### 11.4 What Stays the Same

- Validation rules (min lengths, required fields, email format)
- Backend validates before database (frontend validation is supplementary)

---

## 12. ERROR-HANDLING ARCHITECTURE

### 12.1 Error Hierarchy

```typescript
// src/shared/errors/AppError.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// src/shared/errors/NotFoundError.ts
export class NotFoundError extends AppError {
  constructor(resource: string, id?: number | string) {
    super(404, 'NOT_FOUND', `${resource}${id ? ` with id ${id}` : ''} not found`);
  }
}

// src/shared/errors/UnauthorizedError.ts
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, 'UNAUTHORIZED', message);
  }
}

// src/shared/errors/ForbiddenError.ts
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(403, 'FORBIDDEN', message);
  }
}

// src/shared/errors/ConflictError.ts
export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, 'CONFLICT', message);
  }
}

// src/shared/errors/BadRequestError.ts
export class BadRequestError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(400, 'BAD_REQUEST', message, details);
  }
}
```

### 12.2 Error Handler Middleware

```typescript
// src/shared/errors/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from './AppError';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.statusCode,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details && { details: err.details }),
      },
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Unknown error
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    status: 500,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    },
  });
}
```

### 12.3 What Changes

- Scattered `throw new Error(...)` → specific error classes
- Inconsistent error responses → consistent `{ success, status, error: { code, message } }`
- 400 validation errors → structured `{ details: { field: [errors] } }`

### 12.4 What Stays the Same

- HTTP status codes (400, 401, 403, 404, 500)
- Error messages (keep user-friendly)

---

## 13. API ARCHITECTURE

### 13.1 Route Structure

```typescript
// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './shared/errors/errorHandler';
import { requestLogger } from './shared/middleware/requestLogger';

// Module routes
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import productsRoutes from './modules/products/products.routes';
import categoriesRoutes from './modules/categories/categories.routes';
import favoritesRoutes from './modules/favorites/favorites.routes';
import ordersRoutes from './modules/orders/orders.routes';
import invoicesRoutes from './modules/invoices/invoices.routes';
import salesRoutes from './modules/sales/sales.routes';
import plansRoutes from './modules/plans/plans.routes';
import subscriptionsRoutes from './modules/subscriptions/subscriptions.routes';
import pendingsRoutes from './modules/pendings/pendings.routes';
import webhookRoutes from './modules/webhooks/stripe.routes';

const app = express();

// Global middleware
app.use(helmet());
app.use(cors({ origin: '*', methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'] }));
app.use(requestLogger);

// Stripe webhook needs raw body
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), webhookRoutes);

// JSON parsing for all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', authRoutes);
app.use('/api', usersRoutes);
app.use('/api', productsRoutes);
app.use('/api', categoriesRoutes);
app.use('/api', favoritesRoutes);
app.use('/api', ordersRoutes);
app.use('/api', invoicesRoutes);
app.use('/api', salesRoutes);
app.use('/api', plansRoutes);
app.use('/api', subscriptionsRoutes);
app.use('/api', pendingsRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Error handler (must be last)
app.use(errorHandler);

export default app;
```

### 13.2 Route Handler Pattern

```typescript
// src/modules/users/users.routes.ts
import { Router } from 'express';
import { authenticate } from '../../shared/middleware/authenticate';
import { requireRole } from '../../shared/middleware/requireRole';
import { validate } from '../../shared/validation/validate';
import { userUpdateSchema } from '../../shared/validation/schemas';
import * as usersService from './users.service';

const router = Router();

// GET /users/dashboard-stats
router.get('/users/dashboard-stats', authenticate, async (req, res, next) => {
  try {
    const result = await usersService.getDashboardStats(req.user.userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// PATCH /users/:id
router.patch('/users/:id', authenticate, validate(userUpdateSchema), async (req, res, next) => {
  try {
    const result = await usersService.updateUser(Number(req.params.id), req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
```

### 13.3 What Changes

- routing-controllers decorators → Plain Express Router
- `@JsonController('/users')` → `router = Router(); router.use('/users', ...)`
- `@Get('/:id')` → `router.get('/:id', ...)`
- `@UseBefore(AuthCheck)` → `router.use(authenticate)`
- `@Body()` → `req.body`
- `@Param('id')` → `req.params.id`
- `@LoggedUser()` → `req.user`
- `@QueryParams()` → `req.query`

### 13.4 What Stays the Same

- All API endpoints (same paths)
- All request/response shapes
- Authentication header format
- CORS configuration
- Stripe webhook handling

---

## 14. PAGINATION / FILTERING / SORTING

### 14.1 Pagination Pattern

The frontend already expects and uses pagination for favorites and invoices:

```typescript
// Response shape (preserved)
{
  items: [...],
  total: number,
  page: number,
  totalPages: number
}
```

### 14.2 Query Parameter Parsing

```typescript
// src/shared/utils/pagination.ts
export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export function parsePagination(query: any): PaginationParams {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}
```

### 14.3 Filtering

Replace `typeorm-simple-query-parser` with explicit query parameters:

```typescript
// Example: GET /products?status=available&category_id=1&search=shoes
router.get('/products', authenticate, async (req, res, next) => {
  const { page, limit, offset } = parsePagination(req.query);
  const { status, category_id, search } = req.query;

  const conditions = [];
  if (status) conditions.push(eq(products.status, status as string));
  if (category_id) conditions.push(eq(products.categoryId, Number(category_id)));
  if (search) conditions.push(
    or(
      ilike(products.productName, `%${search}%`),
      ilike(products.productDescription, `%${search}%`)
    )
  );

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [items, total] = await Promise.all([
    db.query.products.findMany({ where, limit, offset }),
    db.select({ count: count() }).from(products).where(where),
  ]);

  res.json({
    items,
    total: total[0].count,
    page,
    totalPages: Math.ceil(total[0].count / limit),
  });
});
```

### 14.4 Sorting

Default sort: `id DESC` (newest first). Allow override via `?sort=created_at&order=desc`.

### 14.5 What Changes

- `typeorm-simple-query-parser` → explicit Zod-validated query params
- `RequestQueryParser` → `parsePagination(req.query)`
- `resourceOptions` pattern → explicit where/sort/limit

### 14.6 What Stays the Same

- Pagination response shape `{ items, total, page, totalPages }`
- Default page size (10)
- Frontend pagination behavior

---

## 15. LOGGING AND OBSERVABILITY

### 15.1 Request Logger

```typescript
// src/shared/middleware/requestLogger.ts
import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      userId: (req as any).user?.userId,
    };

    if (res.statusCode >= 500) {
      console.error('[ERROR]', JSON.stringify(log));
    } else if (res.statusCode >= 400) {
      console.warn('[WARN]', JSON.stringify(log));
    } else {
      console.log('[INFO]', JSON.stringify(log));
    }
  });

  next();
}
```

### 15.2 Database Query Logging

```typescript
// In development, Drizzle can log queries:
import { drizzle } from 'drizzle-orm/node-postgres';

export const db = drizzle(pool, {
  schema,
  logger: process.env.NODE_ENV === 'development',
});
```

### 15.3 Health Check

```typescript
// GET /api/health
router.get('/health', async (req, res) => {
  try {
    await db.execute(sql`SELECT 1`);
    res.json({ status: 'healthy', database: 'connected', timestamp: new Date() });
  } catch {
    res.status(503).json({ status: 'unhealthy', database: 'disconnected', timestamp: new Date() });
  }
});
```

### 15.4 What Stays the Same

- Console logging (just structured better)
- No external logging service needed yet

---

## 16. TESTING STRATEGY

### 16.1 Test Structure

```
tests/
├── unit/
│   ├── auth.service.test.ts
│   ├── users.service.test.ts
│   ├── products.service.test.ts
│   └── ...
├── integration/
│   ├── auth.test.ts
│   ├── users.test.ts
│   ├── products.test.ts
│   ├── orders.test.ts
│   ├── favorites.test.ts
│   ├── invoices.test.ts
│   └── ...
└── fixtures/
    ├── users.ts
    ├── products.ts
    └── ...
```

### 16.2 Critical Workflow Tests

| Flow | Test Cases |
|------|-----------|
| Registration | Valid data → 201 + token. Duplicate email → 409. Invalid data → 400. |
| Login | Valid credentials → 200 + token. Wrong password → 401. Unknown email → 401. |
| Create product | Authenticated + valid data → 201. Unauthenticated → 401. Missing fields → 400. |
| Order + checkout | Create order → Stripe session URL returned. Webhook → order status updated. |
| Favorites | Add favorite → 201. Duplicate → 409. Remove → 204. List → paginated response. |
| Dashboard stats | Authenticated → computed counters match actual counts. |
| Stripe webhook | Valid signature → processed. Invalid → 400. |

### 16.3 Test Setup

```typescript
// tests/helpers/setup.ts
import { db } from '../../src/db/client';
import { sql } from 'drizzle-orm';

export async function resetDatabase() {
  // Truncate all tables in correct order (respect FKs)
  await db.execute(sql`TRUNCATE TABLE favorites, order_items, product_images, 
    sales, invoices, subscriptions, pendings, orders, products, 
    plans, users, roles CASCADE`);
}

export async function seedTestData() {
  // Insert minimal test data
}
```

### 16.4 Test Framework

- **Jest** (already in project)
- **supertest** for HTTP integration tests
- **ts-jest** for TypeScript support

---

## 17. ENVIRONMENT / CONFIGURATION

### 17.1 Environment Variables

```env
# Application
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000
APP_ROUTE_PREFIX=/api

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vulum_dev
DB_USER=postgres
DB_PASSWORD=secret
DB_URL=postgresql://postgres:secret@localhost:5432/vulum_dev

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Email
MAIL_HOST=localhost
MAIL_PORT=1025
MAIL_USER=
MAIL_PASSWORD=
MAIL_FROM=noreply@vulum.com
```

### 17.2 Config Module

```typescript
// src/config/database.ts
export const databaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'vulum_dev',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};
```

### 17.3 What Stays the Same

- Environment variable names (where possible)
- Secrets stay in .env (never committed)
- Different configs per environment

### 17.4 What Changes

- MySQL connection params → PostgreSQL
- `TYPEORM_*` vars → `DB_*` vars
- `.env.example` updated

---

## 18. STRIPE / PAYMENT HANDLING

### 18.1 Stripe Integration Points

| Feature | Stripe API | Backend Handler |
|---------|-----------|-----------------|
| Product creation | `stripe.products.create()` | products.service |
| Price creation | `stripe.prices.create()` | products.service, plans.service |
| Checkout session | `stripe.checkout.sessions.create()` | orders.service, plans.service |
| Customer creation | `stripe.customers.create()` | orders.service |
| Webhook processing | `stripe.webhooks.constructEvent()` | webhooks/stripe.service |
| Subscription retrieval | `stripe.subscriptions.retrieve()` | webhooks/stripe.service |

### 18.2 Webhook Events Handled

- `checkout.session.completed` → Update order status, create sales, update stock, create invoice
- `invoice.created/finalized/paid/failed` → Update invoice status
- `customer.subscription.created/updated/deleted` → Update subscription

### 18.3 Transaction Boundaries in Webhook

```typescript
// In webhook handler:
await db.transaction(async (tx) => {
  // 1. Decrement stock
  // 2. Create sale records
  // 3. Update order status
  // 4. Create/update invoice
  // 5. Update user pricing plan (for subscriptions)
});
```

### 18.4 What Stays the Same

- All Stripe API calls
- Webhook event types handled
- Metadata structure
- Checkout flow

### 18.5 What Could Break

- If Stripe webhook signature verification changes → webhook fails
- If transaction boundaries are wrong → data inconsistency
- **Mitigation:** Keep identical webhook logic, test thoroughly

---

## 19. ROLLBACK STRATEGY

### 19.1 V1 Preservation

- V1 is tagged in git
- MySQL database remains available during transition
- Backend can revert to V1 by switching branches
- Frontend stays compatible with V1 API during transition

### 19.2 Incremental Rollback Points

| Phase | Rollback Point |
|-------|---------------|
| Infrastructure setup | Revert to V1 branch |
| Auth module complete | V1 auth still works |
| Products module complete | V1 products still work |
| Each module | Independent rollback possible |

### 19.3 Production Rollback

1. Keep V1 backend running
2. Deploy V2 alongside (different port or path)
3. Test V2 thoroughly
4. Switch traffic to V2
5. Keep V1 available for 24-48 hours
6. Decommission V1 after verification

### 19.4 Data Rollback

- PostgreSQL data is additive (no data destroyed)
- If rollback needed, V1 MySQL data is untouched
- Backup PostgreSQL before any production migration

---

## 20. IMPLEMENTATION PHASES

### Phase 0: Preparation (Current)
- [x] Database contract documentation
- [x] Issues classification
- [x] Architecture recommendation
- [x] Implementation blueprint (this document)
- [ ] **Approval from user**

### Phase 1: Foundation (Days 1-2)
- [ ] Set up Drizzle ORM (new branch)
- [ ] Create `drizzle.config.ts`
- [ ] Define all PostgreSQL schemas
- [ ] Set up database client with connection pooling
- [ ] Create error hierarchy
- [ ] Create validation middleware (Zod)
- [ ] Create auth middleware (JWT)
- [ ] Create role middleware
- [ ] Set up Express app structure
- [ ] Configure TypeScript

### Phase 2: Database Setup (Day 2-3)
- [ ] Create initial Drizzle migration
- [ ] Set up PostgreSQL in Docker Compose
- [ ] Write MySQL → PostgreSQL data migration script
- [ ] Run migration against local PostgreSQL
- [ ] Verify row counts
- [ ] Verify relationships

### Phase 3: Auth + Users (Days 3-4)
- [ ] Auth routes (login, register)
- [ ] Auth service (JWT, password hashing)
- [ ] Users routes (CRUD, profile, search)
- [ ] Users service (with computed counters for dashboard)
- [ ] Test auth flow end-to-end

### Phase 4: Categories + Products (Days 4-5)
- [ ] Categories routes + service
- [ ] Products routes + service (CRUD, search, images)
- [ ] Cloudinary integration
- [ ] Stripe product/price creation
- [ ] Test product flow

### Phase 5: Favorites (Day 5)
- [ ] Favorites routes + service
- [ ] Duplicate prevention (composite unique)
- [ ] Paginated "my favorites"
- [ ] Test favorites flow

### Phase 6: Orders + Order Items (Days 5-6)
- [ ] Orders routes + service
- [ ] Stripe checkout session creation
- [ ] Order items creation
- [ ] Invoice creation
- [ ] Test order flow

### Phase 7: Invoices + Sales (Day 6-7)
- [ ] Invoices routes + service
- [ ] Paginated "my invoices"
- [ ] Sales routes + service
- [ ] Test invoice flow

### Phase 8: Plans + Subscriptions (Days 7-8)
- [ ] Plans routes + service (pricing)
- [ ] Subscription checkout session
- [ ] Subscriptions routes + service
- [ ] My plan endpoint
- [ ] Test subscription flow

### Phase 9: Webhooks + Pendings (Day 8-9)
- [ ] Stripe webhook handler
- [ ] All webhook event processing
- [ ] Pendings routes + service
- [ ] Test webhook flow

### Phase 10: API Compatibility + Frontend (Days 9-10)
- [ ] Verify all API response shapes match frontend expectations
- [ ] Test Redux state assumptions
- [ ] Test authentication flow end-to-end
- [ ] Fix any frontend breakage

### Phase 11: Testing (Days 10-11)
- [ ] Unit tests for services
- [ ] Integration tests for critical flows
- [ ] API endpoint tests
- [ ] Stripe webhook tests

### Phase 12: Performance + Polish (Days 11-12)
- [ ] Query performance review
- [ ] Index verification
- [ ] Connection pooling tuning
- [ ] Error handling review
- [ ] Logging review

### Phase 13: Production Migration (Days 12-13)
- [ ] Set up Neon/Supabase PostgreSQL
- [ ] Run data migration
- [ ] Deploy V2 backend
- [ ] Verify all functionality
- [ ] Monitor for issues

**Total estimated: ~12-14 days**

---

## 21. RISK REGISTER

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|------------|
| 1 | Frontend breaks due to API changes | Low | High | Keep all response shapes identical |
| 2 | Data loss during migration | Low | Critical | Script migration, verify counts, keep MySQL backup |
| 3 | Stripe webhook breaks | Low | High | Test thoroughly, keep V1 available |
| 4 | Denormalized counter removal breaks dashboard | Medium | High | Compute via COUNT, return same shape |
| 5 | JWT incompatibility | Low | High | Keep identical payload and signing |
| 6 | PostgreSQL type mismatches | Low | Medium | Careful schema mapping |
| 7 | Connection pool exhaustion | Low | Medium | Configure pg pool properly |
| 8 | Transaction deadlocks | Low | Low | Simple transactions, proper ordering |
| 9 | Zod validation too strict | Medium | Medium | Match existing validation rules exactly |
| 10 | Route conflicts | Low | Medium | Test each module independently |

---

## 22. FINAL CHECKLIST

Before implementation begins, confirm:

- [ ] All 13 Drizzle schemas designed and reviewed
- [ ] All API endpoints mapped to V1 equivalents
- [ ] All frontend response shapes identified and preserved
- [ ] Migration script designed
- [ ] Transaction boundaries identified
- [ ] Error hierarchy complete
- [ ] Validation schemas match V1 rules
- [ ] Test strategy defined
- [ ] Rollback strategy defined
- [ ] No breaking API changes without explicit justification

---

*This blueprint is a complete implementation plan. No code has been written. Awaiting approval to begin Phase 1.*
