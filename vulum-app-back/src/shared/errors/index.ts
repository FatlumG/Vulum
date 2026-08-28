/**
 * Structured Error Classes for V2 Backend
 *
 * All application errors extend AppError for consistent error handling.
 * Each error type maps to a specific HTTP status code and provides
 * structured information for debugging without exposing internals.
 *
 * Usage:
 *   throw new NotFoundError('User', userId);
 *   throw new ValidationError('Email is required', { field: 'email' });
 *   throw new ConflictError('Email already exists');
 */

/**
 * Base application error class.
 * All custom errors should extend this.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    statusCode: number,
    code: string,
    isOperational = true,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;

    // Maintain proper stack trace in V8 engines
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Convert to JSON for API responses.
   * Does NOT include stack trace for security.
   */
  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        ...(this.details && { details: this.details }),
      },
    };
  }
}

// ============================================================
// 4xx Client Errors
// ============================================================

/**
 * 400 Bad Request
 * Used for validation errors, malformed requests.
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 400, 'VALIDATION_ERROR', true, details);
  }
}

/**
 * 401 Unauthorized
 * Used when authentication is required but not provided or invalid.
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

/**
 * 403 Forbidden
 * Used when user is authenticated but not authorized for the action.
 */
export class ForbiddenError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403, 'FORBIDDEN');
  }
}

/**
 * 404 Not Found
 * Used when a resource doesn't exist.
 */
export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string | number) {
    const message = identifier
      ? `${resource} with id '${identifier}' not found`
      : `${resource} not found`;
    super(message, 404, 'NOT_FOUND', true, { resource, identifier });
  }
}

/**
 * 409 Conflict
 * Used when an operation conflicts with existing state.
 */
export class ConflictError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 409, 'CONFLICT', true, details);
  }
}

/**
 * 422 Unprocessable Entity
 * Used when request is well-formed but semantically invalid.
 */
export class UnprocessableError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 422, 'UNPROCESSABLE_ENTITY', true, details);
  }
}

/**
 * 429 Too Many Requests
 * Used for rate limiting.
 */
export class RateLimitError extends AppError {
  constructor(message = 'Too many requests, please try again later') {
    super(message, 429, 'RATE_LIMITED');
  }
}

// ============================================================
// 5xx Server Errors
// ============================================================

/**
 * 500 Internal Server Error
 * Used for unexpected errors. isOperational = false.
 */
export class InternalError extends AppError {
  constructor(message = 'Internal server error') {
    super(message, 500, 'INTERNAL_ERROR', false);
  }
}

/**
 * 502 Bad Gateway
 * Used when an external service (Stripe, Cloudinary, etc.) fails.
 */
export class ExternalServiceError extends AppError {
  constructor(service: string, message?: string) {
    super(
      message || `External service error: ${service}`,
      502,
      'EXTERNAL_SERVICE_ERROR',
      true,
      { service }
    );
  }
}

/**
 * 503 Service Unavailable
 * Used when the service is temporarily unavailable (e.g., DB down).
 */
export class ServiceUnavailableError extends AppError {
  constructor(message = 'Service temporarily unavailable') {
    super(message, 503, 'SERVICE_UNAVAILABLE', true);
  }
}

// ============================================================
// Helper: Check if error is operational (safe to expose)
// ============================================================

export function isOperationalError(error: unknown): boolean {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
}

// ============================================================
// Helper: Convert unknown error to AppError
// ============================================================

export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new InternalError(error.message);
  }

  return new InternalError('An unknown error occurred');
}
