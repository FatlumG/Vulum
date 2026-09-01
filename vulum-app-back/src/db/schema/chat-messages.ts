/**
 * Chat Messages table — real-time messaging.
 *
 * Key design decisions:
 * - senderId uses SET NULL: if user is deleted, message history survives.
 * - roomId is a string to support flexible room types (order, product, general).
 * - Content is TEXT (no length limit for chat messages).
 * - Messages are IMMUTABLE HISTORY — no soft delete.
 *   If a message should be removed, it can be marked as deleted via deletedAt.
 *
 * Indexes:
 * - roomIdIdx: room message queries (WHERE room_id = ?)
 * - senderIdIdx: user message history (WHERE sender_id = ?)
 * - createdAtIdx: chronological ordering
 */

import { pgTable, integer, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const chatMessages = pgTable('chat_messages', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  roomId: varchar('room_id', { length: 255 }).notNull(),
  senderId: integer('sender_id')
    .references(() => users.id, { onDelete: 'set null' }),
  content: text('content').notNull(),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => ({
  roomIdIdx: index('idx_chat_messages_room_id').on(t.roomId),
  senderIdIdx: index('idx_chat_messages_sender_id').on(t.senderId),
  createdAtIdx: index('idx_chat_messages_created_at').on(t.createdAt),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  sender: one(users, {
    fields: [chatMessages.senderId],
    references: [users.id],
  }),
}));
