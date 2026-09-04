/**
 * Stripe Connect — TypeScript Types
 *
 * Defines all request/response interfaces for the Stripe Connect module.
 * Maps between V2 database snake_case and API snake_case conventions.
 */

// ============================================================
// Connect Onboarding
// ============================================================

export interface ConnectOnboardingResponse {
  url: string;
  account_id: string;
}

export interface ConnectStatusResponse {
  connected: boolean;
  account_id: string | null;
  onboarding_status: string;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  details_submitted: boolean;
}

// ============================================================
// Webhook Processing
// ============================================================

export interface WebhookEventRecord {
  id: number;
  stripe_event_id: string;
  event_type: string;
  status: string;
  payload: unknown;
  error_message: string | null;
  created_at: Date;
  processed_at: Date | null;
}

// ============================================================
// Commission Calculation
// ============================================================

export interface CommissionBreakdown {
  /** Gross sale amount in cents (EUR minor units) */
  grossAmountCents: number;
  /** Vulum platform fee in cents */
  platformFeeCents: number;
  /** Stripe processing fee in cents (estimated, may be null) */
  stripeFeeCents: number | null;
  /** Seller net amount in cents */
  netAmountCents: number;
  /** Commission rate used at time of sale (e.g., 5.00 for 5%) */
  commissionRate: number;
  /** Currency (ISO 4217) */
  currency: string;
  /** Whether the seller has an active paid subscription */
  hasActiveSubscription: boolean;
}

// ============================================================
// Stripe Connect Account (DB record)
// ============================================================

export interface StripeConnectAccountRecord {
  id: number;
  user_id: number | null;
  stripe_account_id: string;
  onboarding_status: string;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  details_submitted: boolean;
  created_at: Date;
  updated_at: Date;
}

// ============================================================
// Stripe Config response
// ============================================================

export interface StripeConfigResponse {
  publishable_key: string;
  currency: string;
  commission_rate: number;
}
