# V2 ARCHITECTURE RECOMMENDATION

## EXECUTIVE SUMMARY

After analyzing every file in the backend — entities, repositories, services, controllers, auth, migrations, configuration, and dependencies — I recommend:

**Drizzle ORM + PostgreSQL**

This is the strongest long-term choice for this application. Below is the full analysis.

---

## 1. CURRENT ARCHITECTURE INVENTORY

### Stack

| Layer | Current | Status |
|-------|---------|--------|
| Runtime | Node.js + TypeScript 4.4 | Outdated TS |
| Framework | Express 4.17 | Stable |
| Routing | routing-controllers 0.9 | Decorator-based, tied to TypeORM DI |
| ORM | TypeORM 0.2.37 | Deprecated APIs throughout |
| DI Container | typedi + typeorm-typedi-extensions | Tightly coupled to TypeORM 0.2 |
| Validation | class-validator 0.12 | Works, but old |
| Auth | Manual JWT (jsonwebtoken) | Functional, not modular |
| Database | MySQL 8.0 | To be replaced |
| Query Builder | typeorm-simple-query-parser | Adds filtering/pagination |
| Seeding | typeorm-seeding 1.6 | Old, tied to TypeORM 0.2 |
| Events | event-dispatch 0.4 | Used sparingly |
| Stripe | stripe 18.0 | Current |

### TypeORM 0.2 Features Currently Used

| Feature | Where Used | Migration Impact |
|---------|-----------|-----------------|
| `createConnection()` | main.ts | Removed in 0.3 |
| `@EntityRepository()` | All 12 repositories | Removed in 0.3 |
| `BaseEntity` (Active Record) | All 13 entities | Must change to Data Mapper |
| `@InjectRepository()` | All 13 services | Removed in 0.3 |
| `typeorm-typedi-extensions` | Container setup | Deprecated |
| `entity.save()` | Throughout services | Must change to `repository.save()` |
| `entity.reload()` | Not used | N/A |
| `createQueryBuilder()` | Services | Must change to Drizzle query API |
| `getManager().transaction()` | OrderService, webhook | Must change |
| `@BeforeInsert()` / `@BeforeUpdate()` | User entity (password hash) | Must move to service layer |
| `@Column({ type: 'enum' })` | Product, Subscription | PostgreSQL enums work differently |
| `RequestQueryParser` | Controllers for filtering | Custom solution needed |

### TypeORM Penetration

- **13 entities** — all use Active Record pattern
- **12 repositories** — all use `@EntityRepository()` decorator
- **13 services** — all use `@InjectRepository()`
- **5 controllers** — use `RequestQueryParser` from typeorm-simple-query-parser
- **1 webhook handler** — uses `getRepository()` directly in main.ts
- **1 migration** — (AddPerformanceIndexes) uses raw SQL via `queryRunner.query()`
- **2 old migrations** — use TypeORM Table/QueryRunner API

**Verdict:** TypeORM is deeply embedded. A full replacement requires touching every layer, but the codebase is small enough that this is very feasible.

---

## 2. ORM COMPARISON

### Option A: TypeORM 0.3.x (Upgrade)

**What it is:** Upgrade from 0.2 to 0.3 — keep the same ORM, fix deprecated patterns.

| Aspect | Assessment |
|--------|-----------|
| Migration effort | Medium — must change `createConnection` → `DataSource`, remove `@EntityRepository`, remove `@InjectRepository`, change Active Record → Data Mapper |
| Type safety | Moderate — better than 0.2, but still decorator-based |
| PostgreSQL support | Good |
| Migrations | Good — same system, better API |
| QueryBuilder | Good — same API, slightly improved |
| Relations | Good — but eager loading has edge cases |
| Transactions | Good |
| Performance | Good for this scale |
| Ecosystem | Large but declining community trust |
| Long-term outlook | Uncertain — TypeORM has maintenance concerns, many developers migrating away |
| DI integration | Must replace typedi extensions with manual DI or new library |

**Verdict:** Possible, but you're upgrading to a framework that the community is actively migrating away from. The upgrade work is real, and you're still inheriting TypeORM's architectural quirks (Active Record vs Data Mapper confusion, decorator-heavy approach, inconsistent type inference).

### Option B: Prisma

**What it is:** Schema-first ORM with auto-generated TypeScript client.

| Aspect | Assessment |
|--------|-----------|
| Migration effort | High — complete rewrite of all entities, repositories, services, and queries |
| Type safety | Excellent — auto-generated types from schema |
| PostgreSQL support | Excellent |
| Migrations | Excellent — prisma migrate is best-in-class |
| QueryBuilder | Limited — Prisma Client is more of a query API than a builder |
| Relations | Excellent — automatic eager loading, nested writes |
| Transactions | Good — interactive transactions |
| Performance | Good for standard operations, can be slow for complex queries |
| Ecosystem | Large, well-maintained, strong Vercel backing |
| Long-term outlook | Very good — industry momentum |
| DI integration | Not needed — Prisma client is instantiated once |

**Verdict:** Excellent for type safety and DX, but the query API is restrictive. For complex queries (search, dashboard stats, filtering), you'll frequently need `$queryRaw` which defeats the purpose. Also, Prisma generates a new client from schema on every build, which adds complexity to CI/CD.

### Option C: Drizzle ORM

**What it is:** TypeScript ORM with SQL-like API, schema-first, lightweight.

| Aspect | Assessment |
|--------|-----------|
| Migration effort | High — complete rewrite, but schema-first approach is clean |
| Type safety | Excellent — full type inference from schema |
| PostgreSQL support | Excellent — first-class citizen |
| Migrations | Good — drizzle-kit generates migrations from schema |
| QueryBuilder | Excellent — SQL-like API, full flexibility |
| Relations | Good — defined in schema, auto-selectable |
| Transactions | Good — uses database transactions directly |
| Performance | Excellent — minimal overhead, closest to raw SQL |
| Ecosystem | Growing rapidly, strong community |
| Long-term outlook | Very good — modern, well-architected |
| DI integration | Not needed — client is instantiated once |

**Verdict:** Best balance of type safety, flexibility, and performance. SQL-like API means any developer who knows SQL can work with it. No magic, no surprises. Lightest footprint of all options.

### Option D: Kysely

**What it is:** Pure TypeScript query builder, no ORM features.

| Aspect | Assessment |
|--------|-----------|
| Migration effort | Very high — must build everything manually |
| Type safety | Excellent |
| PostgreSQL support | Excellent |
| Migrations | Basic — not built-in |
| QueryBuilder | Excellent — that's all it is |
| Relations | None — must implement manually |
| Transactions | Good |
| Performance | Excellent |
| Ecosystem | Growing, smaller |
| DI integration | Not needed |

**Verdict:** Too low-level for this project. You'd spend significant time building relation handling, eager loading, and entity management that Drizzle gives you for free.

---

## 3. RECOMMENDATION: DRIZZLE ORM

### Why Drizzle

1. **SQL-like API = zero learning curve for SQL developers.** The current codebase has ~15 TypeORM-specific patterns to learn. Drizzle's API looks like SQL:
   ```typescript
   // TypeORM (current)
   await this.userRepository.createQueryBuilder('user')
     .leftJoinAndSelect('user.role', 'role')
     .where('user.id = :id', { id })
     .getOne();

   // Drizzle (target)
   const user = await db.query.users.findFirst({
     where: eq(users.id, id),
     with: { role: true }
   });
   ```

2. **No decorator magic.** TypeORM entities are decorated classes with hidden behavior. Drizzle schemas are explicit TypeScript objects — what you see is what you get.

3. **Full query flexibility.** Unlike Prisma, Drizzle supports complex queries without falling back to raw SQL. Search, filtering, aggregations, CTEs — all native.

4. **TypeScript-first.** Types are inferred from schema, not generated. No build step for types. No code generation. Just TypeScript.

5. **Lightweight.** Drizzle adds minimal overhead. No runtime reflection, no metadata storage, no connection pool management (uses pg driver directly).

6. **PostgreSQL-native.** Enums, JSONB, arrays, full-text search — all first-class.

7. **Migration system.** Drizzle Kit generates SQL migrations from schema changes. Clean, versioned, reproducible.

### Why NOT TypeORM 0.3

- You're doing a major migration anyway (MySQL → PostgreSQL). Upgrading TypeORM adds complexity without solving the fundamental architectural issues.
- TypeORM's community trust has eroded. Many projects are migrating away.
- The Active Record pattern is a poor fit for clean architecture.
- TypeORM 0.3 still has quirks with PostgreSQL enums, eager loading, and type inference.

### Why NOT Prisma

- For this project's search and filtering needs, you'd hit Prisma's query limitations quickly.
- Prisma's code generation adds build complexity.
- Prisma's transaction API is less flexible than Drizzle's.
- The community trend is moving toward SQL-like ORMs (Drizzle, Kysely).

### Why NOT Kysely

- Too low-level. You'd need to build relation handling, entity management, and many convenience features that Drizzle provides.

---

## 4. TARGET ARCHITECTURE

### Directory Structure

```
vulum-app-back/
├── src/
│   ├── db/
│   │   ├── schema/
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
│   │   ├── migrations/
│   │   │   ├── 0000_initial.ts
│   │   │   └── ...
│   │   ├── client.ts          # Drizzle client + pool
│   │   └── index.ts           # Re-exports
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.middleware.ts
│   │   │   └── auth.types.ts
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.types.ts
│   │   ├── products/
│   │   │   ├── products.controller.ts
│   │   │   ├── products.service.ts
│   │   │   └── products.types.ts
│   │   ├── categories/
│   │   │   ├── categories.controller.ts
│   │   │   ├── categories.service.ts
│   │   │   └── categories.types.ts
│   │   ├── orders/
│   │   │   ├── orders.controller.ts
│   │   │   ├── orders.service.ts
│   │   │   └── orders.types.ts
│   │   ├── payments/
│   │   │   ├── payments.controller.ts
│   │   │   ├── payments.service.ts
│   │   │   └── payments.types.ts
│   │   ├── subscriptions/
│   │   │   ├── subscriptions.controller.ts
│   │   │   ├── subscriptions.service.ts
│   │   │   └── subscriptions.types.ts
│   │   ├── invoices/
│   │   │   ├── invoices.controller.ts
│   │   │   ├── invoices.service.ts
│   │   │   └── invoices.types.ts
│   │   ├── sales/
│   │   │   ├── sales.controller.ts
│   │   │   ├── sales.service.ts
│   │   │   └── sales.types.ts
│   │   └── favorites/
│   │       ├── favorites.controller.ts
│   │       ├── favorites.service.ts
│   │       └── favorites.types.ts
│   ├── shared/
│   │   ├── errors/
│   │   │   ├── AppError.ts
│   │   │   ├── NotFoundError.ts
│   │   │   ├── UnauthorizedError.ts
│   │   │   ├── ForbiddenError.ts
│   │   │   ├── ConflictError.ts
│   │   │   └── errorHandler.ts
│   │   ├── validation/
│   │   │   └── schemas.ts       # Zod schemas
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── requestLogger.ts
│   │   ├── utils/
│   │   │   ├── env.ts
│   │   │   ├── hash.ts
│   │   │   └── jwt.ts
│   │   └── types/
│   │       └── index.ts
│   ├── config/
│   │   ├── app.ts
│   │   ├── auth.ts
│   │   ├── database.ts
│   │   └── stripe.ts
│   ├── app.ts                  # Express app setup
│   └── server.ts               # Entry point
├── drizzle.config.ts
├── package.json
└── tsconfig.json
```

### Key Architectural Decisions

#### 1. Schema-First with Drizzle

```typescript
// src/db/schema/users.ts
import { pgTable, serial, varchar, bigint, integer, timestamp, boolean, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 191 }).unique().notNull(),
  email: varchar('email', { length: 191 }).unique().notNull(),
  password: varchar('password', { length: 191 }).notNull(),
  first_name: varchar('first_name', { length: 191 }).notNull(),
  last_name: varchar('last_name', { length: 191 }).notNull(),
  bio: text('bio'),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  profile_photo_url: text('profile_photo_url'),
  role_id: integer('role_id').references(() => roles.id).default(5),
  pricing_plan_id: integer('pricing_plan_id').references(() => plans.id),
  stripe_customer_id: varchar('stripe_customer_id', { length: 255 }),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, { fields: [users.role_id], references: [roles.id] }),
  pricing_plan: one(plans, { fields: [users.pricing_plan_id], references: [plans.id] }),
  products: many(products),
  orders: many(orders),
  favorites: many(favorites),
  invoices: many(invoices),
  subscriptions: many(subscriptions),
}));
```

#### 2. Eliminate Denormalized Counters

Remove `products`, `orders`, `sales`, `favorites`, `pendings`, `todos`, `payments` columns from `users`. Replace with computed queries:

```typescript
// Instead of user.products (counter column):
const productCount = await db.select({ count: count() })
  .from(products)
  .where(eq(products.created_by, userId));

// Dashboard stats become:
async getDashboardStats(userId: number) {
  const [productCount, orderCount, salesCount, favoriteCount] = await Promise.all([
    db.select({ count: count() }).from(products).where(eq(products.created_by, userId)),
    db.select({ count: count() }).from(orders).where(eq(orders.created_by, userId)),
    db.select({ count: count() }).from(sales).where(eq(sales.user_id, userId)),
    db.select({ count: count() }).from(favorites).where(eq(favorites.user_id, userId)),
  ]);
  return { products: productCount[0].count, orders: orderCount[0].count, ... };
}
```

#### 3. Proper Error Hierarchy

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
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: number | string) {
    super(404, 'NOT_FOUND', `${resource} not found${id ? `: ${id}` : ''}`);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, 'CONFLICT', message);
  }
}
```

#### 4. Consistent API Response Structure

```typescript
// Success
{ success: true, data: { ... } }
{ success: true, data: [...], pagination: { page, limit, total, totalPages } }

// Error
{ success: false, error: { code: 'NOT_FOUND', message: '...' } }
```

#### 5. Authentication Middleware

```typescript
// src/shared/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig } from '../../config/auth';
import { UnauthorizedError } from '../errors/UnauthorizedError';

export interface AuthenticatedRequest extends Request {
  user: { userId: number; email: string; role: string };
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new UnauthorizedError('No token provided');

  try {
    const decoded = jwt.verify(token, authConfig.providers.jwt.secret);
    (req as AuthenticatedRequest).user = decoded as any;
    next();
  } catch {
    throw new UnauthorizedError('Invalid token');
  }
}
```

#### 6. Database Client

```typescript
// src/db/client.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const db = drizzle(pool, { schema });
```

---

## 5. POSTGRESQL SCHEMA TARGET

### Data Type Mapping (MySQL → PostgreSQL)

| MySQL Type | PostgreSQL Type | Notes |
|-----------|----------------|-------|
| `bigint` (auto-inc) | `serial` / `bigserial` | Use `serial` for most, `bigserial` if needed |
| `int` (auto-inc) | `serial` | |
| `varchar(N)` | `varchar(N)` | Same |
| `text` | `text` | Same |
| `decimal(P,S)` | `decimal(P,S)` | Same — good for money |
| `boolean` | `boolean` | Same |
| `timestamp` | `timestamp` | Same |
| `enum` | `varchar` + CHECK | PostgreSQL has native enums but CHECK is more portable |
| `bigint` (for amount_due) | `integer` | Change invoice.amount_due to decimal for money |

### Schema Fixes During Migration

1. **`invoices.amount_due`** — Change from `bigint` to `decimal(12,2)` for proper money handling
2. **`favorites`** — Add composite unique `(user_id, product_id)` (already planned in index migration)
3. **`users.role_id`** — Fix default to reference actual role ID (currently defaults to 5, but roles table only has 2 entries)
4. **`pendings.order_id`** — Add foreign key to `orders(id)`
5. **`sales`** — Fix `@OneToMany` to Order → should be `@ManyToOne`
6. **`product_images.product_id`** — Fix type from `Product` entity to `number`

### Remove

- All 7 denormalized counter columns from `users`
- MySQL-specific enum syntax (use CHECK constraints for portability)

### Add

- `created_at` / `updated_at` on all tables where missing
- Composite unique on `favorites(user_id, product_id)`
- Foreign key on `pendings.order_id`
- Proper monetary types throughout

---

## 6. MIGRATION PLAN

### Phase 0: Preparation (Current)
- [x] Document current database contract
- [x] Classify all issues (Category A/B/C)
- [x] Create index migration (MySQL) — ready to run against dev
- [ ] **Run index migration against dev database** (requires user action)

### Phase 1: Foundation
- [ ] Set up Drizzle ORM in a new branch
- [ ] Create `drizzle.config.ts`
- [ ] Define all PostgreSQL schemas in `src/db/schema/`
- [ ] Set up database client with connection pooling
- [ ] Set up Zod validation schemas (shared with Drizzle schema)
- [ ] Create error hierarchy (`AppError`, `NotFoundError`, etc.)
- [ ] Create consistent API response helpers

### Phase 2: Database Migration
- [ ] Create initial Drizzle migration from current MySQL schema
- [ ] Set up PostgreSQL in Docker Compose (alongside MySQL during transition)
- [ ] Write data migration script (MySQL → PostgreSQL)
- [ ] Verify row counts match
- [ ] Verify relationships match
- [ ] Test against local PostgreSQL

### Phase 3: Backend Rewrite (Module by Module)
- [ ] Auth module (login, register, JWT, middleware)
- [ ] Users module (CRUD, profile, search)
- [ ] Categories module (CRUD)
- [ ] Products module (CRUD, search, images)
- [ ] Orders module (checkout, Stripe session)
- [ ] Favorites module (toggle, list)
- [ ] Invoices module
- [ ] Sales module
- [ ] Subscriptions module
- [ ] Payments/Stripe webhook handler
- [ ] Dashboard stats (replace counter columns with COUNT queries)
- [ ] Pending orders

### Phase 4: API Compatibility
- [ ] Verify all API response structures match frontend expectations
- [ ] Update frontend API calls if needed
- [ ] Test Redux state assumptions
- [ ] Test authentication flow end-to-end

### Phase 5: Production Migration
- [ ] Set up Neon or Supabase PostgreSQL
- [ ] Run data migration against production
- [ ] Update environment variables
- [ ] Deploy new backend
- [ ] Verify all functionality
- [ ] Keep MySQL as fallback until confirmed stable

---

## 7. RISK ASSESSMENT

| Risk | Severity | Mitigation |
|------|----------|------------|
| Frontend breaks due to API changes | High | Keep API contracts identical. Use same response shapes. |
| Data loss during MySQL → PostgreSQL migration | High | Script the migration, verify row counts, keep MySQL backup |
| Stripe webhook breaks | High | Test webhook handler thoroughly before deploying |
| Authentication breaks | Medium | Test login/register/JWT end-to-end |
| Denormalized counter removal breaks dashboard | Medium | Replace with COUNT queries, verify frontend consumption |
| TypeORM 0.2 → Drizzle rewrite introduces bugs | Medium | Module-by-module migration, test each module |
| PostgreSQL enum differences | Low | Use CHECK constraints instead of native enums |
| Connection pooling issues | Low | Configure `pg` pool properly from start |

---

## 8. ESTIMATED EFFORT

| Phase | Effort | Notes |
|-------|--------|-------|
| Phase 0 | Done | Documentation complete |
| Phase 1 (Foundation) | 2-3 days | Drizzle setup, schemas, error handling |
| Phase 2 (DB Migration) | 1-2 days | Schema, data migration, local testing |
| Phase 3 (Backend Rewrite) | 5-8 days | Module-by-module, most work is here |
| Phase 4 (API Compatibility) | 1-2 days | Frontend verification |
| Phase 5 (Production) | 1-2 days | Deployment, verification |
| **Total** | **~10-17 days** | |

---

## 9. WHAT CHANGES IN THE FRONTEND

**Minimal changes expected:**

- API response shapes should stay identical
- Redux state assumptions should stay identical
- Authentication flow should stay identical
- If we maintain the same endpoints and response structures, the frontend needs zero changes

If we do want to improve the API (e.g., add proper pagination, consistent error responses), those changes would require frontend updates. But that's optional and separate from the database migration.

---

## 10. FINAL RECOMMENDATION

**Choose Drizzle ORM + PostgreSQL.**

- The current TypeORM 0.2 setup is deprecated and deeply embedded
- A PostgreSQL migration is the perfect time to choose the right ORM
- Drizzle provides the best balance of type safety, flexibility, and long-term maintainability
- The codebase is small enough (13 entities, 12 repositories, 13 services) that a rewrite is very feasible
- The architecture can be significantly improved in the process

**Do not:**
- Upgrade TypeORM to 0.3 just to stay familiar
- Choose Prisma and hit query limitations for search/filtering
- Over-engineer with microservices, CQRS, or complex patterns

**Do:**
- Use Drizzle's SQL-like API for clear, maintainable queries
- Implement proper error handling from day one
- Use Zod for validation (shares types with Drizzle schema)
- Keep the service layer clean and testable
- Maintain API compatibility with the frontend

**The single most important principle:**
> Build a clean, modular monolith with strong PostgreSQL foundation that can scale naturally — without sacrificing V1's stability.

---

*This document is a recommendation only. No implementation has begun.*
