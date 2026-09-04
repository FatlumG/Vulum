/**
 * Auth Service
 *
 * Handles login and register logic.
 * Uses Drizzle ORM + PostgreSQL.
 * Preserves V1 API response contract exactly.
 *
 * V1 flow:
 *   Login:   find user by email → compare password → sign JWT → return { user, access_token, expires_in }
 *   Register: create user → find user with role → sign JWT → return { user, access_token, expires_in }
 */

import { db } from '../../db/client';
import { users, roles } from '../../db/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { authConfig } from '../../config/auth';
import {
  JwtPayload,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from './auth.types';
import {
  UnauthorizedError,
  ConflictError,
  ValidationError,
} from '../../shared/errors';

// ============================================================
// Login
// ============================================================

export async function login(data: LoginRequest): Promise<AuthResponse> {
  // 1. Find user by email with role relation
  const result = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      password: users.password,
      firstName: users.firstName,
      lastName: users.lastName,
      roleId: users.roleId,
      roleName: roles.roleName,
    })
    .from(users)
    .leftJoin(roles, eq(users.roleId, roles.id))
    .where(eq(users.email, data.email))
    .limit(1);

  const user = result[0];

  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // 2. Compare password
  const passwordMatch = await bcrypt.compare(data.password, user.password);

  if (!passwordMatch) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // 3. Sign JWT — payload matches V1 exactly
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role_id: user.roleId ?? 0,
    role: user.roleName ?? 'user',
  };

  const token = jwt.sign(payload, authConfig.providers.jwt.secret, {
    expiresIn: authConfig.providers.jwt.expiresIn,
  });

  // 4. Return response — shape matches V1 exactly
  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.roleName ?? 'user',
    },
    access_token: token,
    expires_in: authConfig.providers.jwt.expiresIn,
  };
}

// ============================================================
// Register
// ============================================================

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  // 1. Check email uniqueness
  const existingUser = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, data.email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new ConflictError('Email already registered');
  }

  // 2. Check username uniqueness
  const existingUsername = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, data.username))
    .limit(1);

  if (existingUsername.length > 0) {
    throw new ConflictError('Username already taken');
  }

  // 3. Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(data.password, saltRounds);

  // 4. Get default role (user role)
  const defaultRole = await db
    .select({ id: roles.id, roleName: roles.roleName })
    .from(roles)
    .where(eq(roles.roleName, 'user'))
    .limit(1);

  const roleId = defaultRole[0]?.id ?? 5; // Fallback to 5 if seed not run

  // 5. Insert user
  const [newUser] = await db
    .insert(users)
    .values({
      username: data.username,
      email: data.email,
      password: hashedPassword,
      firstName: data.first_name,
      lastName: data.last_name,
      roleId: roleId,
    })
    .returning({
      id: users.id,
      email: users.email,
    });

  // 6. Get role name for JWT
  const roleName = defaultRole[0]?.roleName ?? 'user';

  // 7. Sign JWT — payload matches V1 exactly
  const payload: JwtPayload = {
    userId: newUser.id,
    email: newUser.email,
    role_id: roleId,
    role: roleName,
  };

  const token = jwt.sign(payload, authConfig.providers.jwt.secret, {
    expiresIn: authConfig.providers.jwt.expiresIn,
  });

  // 8. Return response — shape matches V1 exactly
  return {
    user: {
      id: newUser.id,
      email: newUser.email,
      role: roleName,
    },
    access_token: token,
    expires_in: authConfig.providers.jwt.expiresIn,
  };
}
