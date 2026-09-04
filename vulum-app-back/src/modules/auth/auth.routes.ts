/**
 * Auth Routes
 *
 * POST /login   — Authenticate user, return JWT
 * POST /register — Create new user, return JWT
 *
 * These routes preserve V1 API contract exactly.
 * Frontend calls: POST /api/login and POST /api/register
 */

import { Router, Request, Response, NextFunction } from 'express';
import { validate } from '../../shared/validation';
import { authSchemas } from '../../shared/validation';
import * as authService from './auth.service';

const router = Router();

// ============================================================
// POST /login
// Body: { email, password }
// Response: { user: { id, email, role }, access_token, expires_in }
// ============================================================
router.post(
  '/login',
  validate(authSchemas.login),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.login(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================
// POST /register
// Body: { username, first_name, last_name, email, password }
// Response: { user: { id, email, role }, access_token, expires_in }
// ============================================================
router.post(
  '/register',
  validate(authSchemas.register),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
