/**
 * Chat Service
 *
 * Handles chat message CRUD and room-based queries.
 * Uses Drizzle ORM + PostgreSQL.
 *
 * V1 behavior (preserved via Socket.IO events):
 *   - 'save-message' → 'message-saved' echo pattern
 *   - No persistence (V1 was ephemeral)
 *
 * V2 enhancement:
 *   - All messages persisted to chat_messages table
 *   - Room-based messaging (room_id is a string like "order:123" or "general")
 *   - Sender info (username, profile photo) included in responses
 *   - Soft delete via deletedAt
 *   - Pagination for message history
 *   - JWT authentication on socket connections
 */

import { db } from '../../db/client';
import { chatMessages, users } from '../../db/schema';
import { eq, count, desc, and, isNull } from 'drizzle-orm';
import { NotFoundError, ValidationError } from '../../shared/errors';
import type {
  ChatMessageResponse,
  ChatMessageListResponse,
} from './chat.types';

// ============================================================
// Field Mapping: Drizzle camelCase → API snake_case
// ============================================================

function toChatMessageResponse(
  row: typeof chatMessages.$inferSelect & {
    sender_username?: string | null;
    sender_profile_photo_url?: string | null;
  }
): ChatMessageResponse {
  return {
    id: row.id,
    room_id: row.roomId,
    sender_id: row.senderId,
    sender_username: row.sender_username ?? null,
    sender_profile_photo_url: row.sender_profile_photo_url ?? null,
    content: row.content,
    deleted_at: row.deletedAt,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

// ============================================================
// getMessagesByRoom — Paginated messages for a room
// ============================================================

export async function getMessagesByRoom(
  roomId: string,
  page = 1,
  limit = 50
): Promise<ChatMessageListResponse> {
  const offset = (page - 1) * limit;

  const [items, totalResult] = await Promise.all([
    db
      .select({
        id: chatMessages.id,
        roomId: chatMessages.roomId,
        senderId: chatMessages.senderId,
        content: chatMessages.content,
        deletedAt: chatMessages.deletedAt,
        createdAt: chatMessages.createdAt,
        updatedAt: chatMessages.updatedAt,
        sender_username: users.username,
        sender_profile_photo_url: users.profilePhotoUrl,
      })
      .from(chatMessages)
      .leftJoin(users, eq(chatMessages.senderId, users.id))
      .where(
        and(
          eq(chatMessages.roomId, roomId),
          isNull(chatMessages.deletedAt)
        )
      )
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: count() })
      .from(chatMessages)
      .where(
        and(
          eq(chatMessages.roomId, roomId),
          isNull(chatMessages.deletedAt)
        )
      ),
  ]);

  const total = totalResult[0]?.count ?? 0;

  return {
    items: items.map(toChatMessageResponse),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// ============================================================
// getMessageById — Single message
// ============================================================

export async function getMessageById(id: number): Promise<ChatMessageResponse> {
  const result = await db
    .select({
      id: chatMessages.id,
      roomId: chatMessages.roomId,
      senderId: chatMessages.senderId,
      content: chatMessages.content,
      deletedAt: chatMessages.deletedAt,
      createdAt: chatMessages.createdAt,
      updatedAt: chatMessages.updatedAt,
      sender_username: users.username,
      sender_profile_photo_url: users.profilePhotoUrl,
    })
    .from(chatMessages)
    .leftJoin(users, eq(chatMessages.senderId, users.id))
    .where(eq(chatMessages.id, id))
    .limit(1);

  const row = result[0];
  if (!row) {
    throw new NotFoundError('Chat message', id);
  }

  return toChatMessageResponse(row);
}

// ============================================================
// createMessage — Save a new message (called by Socket.IO handler)
// ============================================================

export async function createMessage(
  roomId: string,
  senderId: number | null,
  content: string
): Promise<ChatMessageResponse> {
  if (!content || !content.trim()) {
    throw new ValidationError('Message content is required');
  }
  if (!roomId) {
    throw new ValidationError('Room ID is required');
  }

  const [row] = await db
    .insert(chatMessages)
    .values({
      roomId,
      senderId,
      content: content.trim(),
    })
    .returning();

  if (!row) {
    throw new Error('Failed to create chat message');
  }

  // Fetch sender info for the response
  let senderUsername: string | null = null;
  let senderProfilePhotoUrl: string | null = null;

  if (senderId) {
    const senderResult = await db
      .select({
        username: users.username,
        profilePhotoUrl: users.profilePhotoUrl,
      })
      .from(users)
      .where(eq(users.id, senderId))
      .limit(1);

    if (senderResult[0]) {
      senderUsername = senderResult[0].username;
      senderProfilePhotoUrl = senderResult[0].profilePhotoUrl;
    }
  }

  return toChatMessageResponse({
    ...row,
    sender_username: senderUsername,
    sender_profile_photo_url: senderProfilePhotoUrl,
  });
}

// ============================================================
// softDeleteMessage — Mark message as deleted
// ============================================================

export async function softDeleteMessage(
  id: number,
  senderId: number
): Promise<void> {
  const existing = await db
    .select({ id: chatMessages.id, senderId: chatMessages.senderId })
    .from(chatMessages)
    .where(eq(chatMessages.id, id))
    .limit(1);

  if (!existing[0]) {
    throw new NotFoundError('Chat message', id);
  }

  // Only the sender can delete their own message
  if (existing[0].senderId !== senderId) {
    throw new NotFoundError('Chat message', id);
  }

  await db
    .update(chatMessages)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(chatMessages.id, id));
}
