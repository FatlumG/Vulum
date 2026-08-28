import { pgEnum } from 'drizzle-orm/pg-core';

/**
 * PostgreSQL enum types for all finite-domain status/billing fields.
 *
 * Using pgEnum instead of VARCHAR+CHECK because:
 * - Type-safe at the database level
 * - Prevents invalid values at insert time
 * - Visible in pg_catalog for documentation
 * - Easily extensible with ALTER TYPE ... ADD VALUE
 */

// Product status: lifecycle of a product listing
export const productStatusEnum = pgEnum('product_status', [
  'pending',   // Awaiting admin approval
  'approved',  // Live and visible to buyers
  'rejected',  // Rejected by admin
]);

// Order status: lifecycle of a customer order
export const orderStatusEnum = pgEnum('order_status', [
  'pending',    // Created, not yet paid
  'paid',       // Payment confirmed
  'shipped',    // Shipped to customer
  'delivered',  // Delivered successfully
  'cancelled',  // Cancelled by user or admin
  'refunded',   // Payment refunded
]);

// Invoice status: mirrors Stripe invoice lifecycle
export const invoiceStatusEnum = pgEnum('invoice_status', [
  'draft',        // Initial state
  'open',         // Awaiting payment
  'paid',         // Payment received
  'void',         // Cancelled before payment
  'uncollectible', // Payment failed permanently
]);

// Subscription status: mirrors Stripe subscription lifecycle
export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'trialing',   // In trial period
  'active',     // Currently active
  'past_due',   // Payment overdue
  'canceled',   // Canceled by user/admin
  'unpaid',     // Payment failed
]);

// Billing cycle for plans
export const billingCycleEnum = pgEnum('billing_cycle', [
  'monthly',
  'yearly',
  'none',      // One-time or free plan
]);
