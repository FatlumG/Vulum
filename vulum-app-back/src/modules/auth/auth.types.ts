/**
 * Auth Module Types
 *
 * These types define the JWT payload and API response shapes.
 * They MUST match V1 exactly to preserve frontend compatibility.
 */

// ============================================================
// JWT Payload — matches V1 JWTProvider.sign() payload
// ============================================================

export interface JwtPayload {
  userId: number;
  email: string;
  role_id: number;
  role: string; // role.role_name from the database
}

// ============================================================
// Auth Response — matches V1 JWTProvider.sign() return shape
// ============================================================

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    role: string;
  };
  access_token: string;
  expires_in: string;
}

// ============================================================
// Request types
// ============================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}
