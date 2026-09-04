import { pgTable, integer, varchar, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core';

/**
 * Webhook Events — idempotent Stripe webhook processing.
 *
 * Key design decisions:
 * - stripeEventId is UNIQUE: prevents duplicate event processing.
 * - status tracks processing lifecycle: pending → processed | failed | ignored
 * - payload stores the full Stripe event JSON for audit/debugging.
 * - processed_at: when the event was successfully handled.
 * - Index on stripeEventId: fast lookup for idempotency check.
 * - Index on eventType: filter events by type for debugging.
 */
export const webhookEvents = pgTable('webhook_events', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  stripeEventId: varchar('stripe_event_id', { length: 255 }).unique().notNull(),
  eventType: varchar('event_type', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  payload: jsonb('payload').notNull(),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  processedAt: timestamp('processed_at'),
}, (t) => ({
  stripeEventIdIdx: index('idx_webhook_events_stripe_event_id').on(t.stripeEventId),
  eventTypeIdx: index('idx_webhook_events_event_type').on(t.eventType),
}));
