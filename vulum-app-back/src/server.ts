/**
 * V2 Server Entry Point
 *
 * This is the V2 backend entry point using Drizzle ORM + PostgreSQL.
 * It runs on a SEPARATE PORT from V1 (default: 3001).
 *
 * V1 (main.ts) remains completely untouched.
 * V2 can be started independently for testing.
 *
 * Usage:
 *   npx ts-node src/server.ts
 *   or
 *   npm run dev:v2
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { pool } from './db/client';
import { requestLogger } from './shared/middleware/requestLogger';
import { errorHandler, notFoundHandler } from './shared/middleware/errorHandler';
import healthRoutes from './shared/health';

// Module routes
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import categoriesRoutes from './modules/categories/categories.routes';
import productsRoutes from './modules/products/products.routes';

// ============================================================
// App Setup
// ============================================================

const app = express();
const port = Number(process.env.V2_PORT) || 3001;

// ============================================================
// Global Middleware
// ============================================================

// Security headers
app.use(helmet());

// CORS — same config as V1
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type', 'Authorization', 'Stripe-Signature'],
  })
);

// Request logging
app.use(requestLogger);

// JSON parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files (profile pictures, etc.)
app.use('/public', express.static('src/public', { maxAge: 31557600000 }));

// ============================================================
// API Routes
// ============================================================

// Health checks (from Phase 1)
app.use('/api', healthRoutes);

// Auth routes: POST /api/login, POST /api/register
app.use('/api', authRoutes);

// Users routes: GET /api/users/*, PATCH /api/users/*, PUT /api/users/*
app.use('/api', usersRoutes);

// Categories routes: GET /api/categories, POST, PUT, DELETE
app.use('/api', categoriesRoutes);

// Products routes: GET /api/products/*, POST, PUT, PATCH, DELETE
app.use('/api', productsRoutes);

// ============================================================
// Default route
// ============================================================

app.get('/', (_req, res) => {
  res.json({
    name: 'Vulum API V2',
    version: '2.0.0',
    orm: 'Drizzle ORM',
    database: 'PostgreSQL',
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// Error Handling (must be last)
// ============================================================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ============================================================
// Start Server
// ============================================================

async function start() {
  try {
    // Verify database connection
    const client = await pool.connect();
    console.log('✅ PostgreSQL connected');
    client.release();

    app.listen(port, () => {
      console.log(`\n🚀 V2 Server started at http://localhost:${port}`);
      console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Database: PostgreSQL (Drizzle ORM)`);
      console.log(`\n📌 V2 API endpoints:`);
      console.log(`   POST   /api/login`);
      console.log(`   POST   /api/register`);
      console.log(`   GET    /api/users/dashboard-stats`);
      console.log(`   GET    /api/users/get-monthly-stats`);
      console.log(`   GET    /api/users/profile`);
      console.log(`   GET    /api/users/me`);
      console.log(`   GET    /api/users/:username`);
      console.log(`   PATCH  /api/users/:id`);
      console.log(`   PUT    /api/users/update-my-profile-picture`);
      console.log(`   GET    /api/categories`);
      console.log(`   GET    /api/categories/:id`);
      console.log(`   POST   /api/categories`);
      console.log(`   PUT    /api/categories/:id`);
      console.log(`   DELETE /api/categories/:id`);
      console.log(`   GET    /api/products`);
      console.log(`   GET    /api/products/:id`);
      console.log(`   POST   /api/products`);
      console.log(`   PUT    /api/products/:id`);
      console.log(`   PATCH  /api/products/:id`);
      console.log(`   DELETE /api/products/:id`);
      console.log(`   GET    /api/health`);
      console.log(`   GET    /api/health/db`);
      console.log(`   GET    /api/health/ready`);
      console.log(`\n⚠️  V1 server (main.ts) is NOT affected.\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start V2 server:', error);
    process.exit(1);
  }
}

start();

export default app;
