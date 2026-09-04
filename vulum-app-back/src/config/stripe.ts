import Stripe from 'stripe';

/**
 * Stripe Client Configuration
 *
 * Initializes the Stripe SDK with:
 * - API key from STRIPE_SECRET_KEY environment variable
 * - API version pinned for consistency
 * - Connect support via stripeAccount header when needed
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-08-27.basil',
});

export default stripe;

/**
 * Platform Configuration
 *
 * Central place for Stripe Connect platform settings.
 * Commission rate is stored as a percentage (e.g., 5 = 5%).
 * All monetary calculations use EUR minor units (cents).
 */
export const stripeConfig = {
  /** Vulum's commission percentage for free-tier sellers */
  commissionRate: Number(process.env.VULUM_COMMISSION_RATE) || 5,

  /** Platform currency (ISO 4217) */
  currency: process.env.VULUM_CURRENCY || 'eur',

  /** Stripe publishable key for frontend */
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',

  /** Webhook endpoint secrets */
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  connectWebhookSecret: process.env.STRIPE_CONNECT_WEBHOOK_SECRET || '',

  /** Success/cancel redirect URLs */
  successUrl: process.env.SUCCESS_URL || 'http://localhost:5173/dashboard',
  cancelUrl: process.env.CANCEL_URL || 'http://localhost:5173/pricing',

  /** Stripe Connect onboarding redirect URLs */
  connectOnboardingReturnUrl: process.env.CONNECT_RETURN_URL || 'http://localhost:5173/settings',
  connectOnboardingRefreshUrl: process.env.CONNECT_REFRESH_URL || 'http://localhost:5173/settings',
} as const;
