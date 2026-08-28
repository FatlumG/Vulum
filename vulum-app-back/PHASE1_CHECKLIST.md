# Phase 1 — Foundation Checklist

**Status:** IN PROGRESS
**Started:** $(date)
**V1 Preserved:** ✅ No existing files modified

---

## Checklist

### Infrastructure

- [ ] 1.1 Install Drizzle dependencies
- [ ] 1.2 Update Docker Compose for PostgreSQL dev instance
- [ ] 1.3 Create environment configuration (config/database.ts)
- [ ] 1.4 Create database client (src/db/client.ts)

### Schema & Migrations

- [ ] 1.5 Verify Drizzle schema files compile
- [ ] 1.6 Create migration generation script
- [ ] 1.7 Test migration generation (dry run)

### Shared Foundation

- [ ] 1.8 Create error classes (src/shared/errors/)
- [ ] 1.9 Create Zod validation schemas (src/shared/validation/)
- [ ] 1.10 Create shared middleware (authenticate, requireRole, errorHandler, requestLogger)

### Database Operations

- [ ] 1.11 Create health check endpoint
- [ ] 1.12 Create seed strategy for development

### Verification

- [ ] 1.13 TypeScript compilation passes
- [ ] 1.14 Drizzle migration generation works
- [ ] 1.15 Existing V1 code untouched
- [ ] 1.16 No secrets exposed

---

## Files Created (Phase 1)

| File | Purpose |
|------|---------|
| src/db/schema/*.ts | Drizzle schema definitions |
| src/db/client.ts | Database connection pool |
| src/db/triggers.sql | updated_at trigger |
| src/config/database.ts | PostgreSQL config |
| src/shared/errors/index.ts | Error classes |
| src/shared/validation/index.ts | Zod schemas |
| src/shared/middleware/index.ts | Express middleware |
| src/shared/middleware/authenticate.ts | JWT authentication |
| src/shared/middleware/requireRole.ts | Role authorization |
| src/shared/middleware/errorHandler.ts | Global error handler |
| src/shared/middleware/requestLogger.ts | Request logging |
| drizzle.config.ts | Drizzle Kit config |
| docker-compose.dev.yml | PostgreSQL dev setup |
| .env.example (updated) | Added DATABASE_URL |

## Files NOT Modified (V1 Preserved)

| File | Status |
|------|--------|
| src/main.ts | ✅ Untouched |
| src/api/**/* | ✅ Untouched |
| src/config/app.ts | ✅ Untouched |
| src/config/db.ts | ✅ Untouched |
| package.json | ✅ Untouched (deps added via npm install) |

---

## Commands Used

```bash
# Install dependencies
npm install drizzle-orm pg drizzle-kit
npm install -D @types/pg

# Generate migrations
npx drizzle-kit generate

# Apply migrations (when DB is ready)
npx drizzle-kit migrate

# Studio (optional, for visual inspection)
npx drizzle-kit studio
```

---

## Warnings & Risks

| Risk | Mitigation |
|------|------------|
| Dual DB dependencies (mysql2 + pg) | Both coexist during migration period |
| V1 code uses TypeORM patterns | V1 code untouched; new code uses Drizzle |
| Schema files in src/db/ not imported by V1 | No side effects on existing code |

---

## What Phase 2 Should Do

1. Replace TypeORM with Drizzle in auth module (login, register)
2. Create new auth routes using Express Router
3. Test auth flow against PostgreSQL
4. Begin module-by-module migration

---

*Phase 1 completion requires all checkboxes marked ✅*
