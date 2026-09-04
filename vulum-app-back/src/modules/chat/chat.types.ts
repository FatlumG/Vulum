/**
 * Chat Types
 *
 * TypeScript interfaces for Chat request/response shapes.
 * V2 schema: src/db/schema/chat-messages.ts (table: "chat_messages")
 *
 * V1 behavior:
 *   - Socket.IO only, no REST endpoints
 *   - @OnConnect / @OnDisconnect lifecycle
 *   - @OnMessage('save-message') → emit('message-saved')
 *   - No database persistence
 *   - No authentication on socket
 *
 * V2 enhancement:
 *   - Database persistence via chat_messages table
 *   - JWT authentication on socket connections
 *   - REST endpoints for message history
 *   - Room-based messaging
 *   - Soft delete (deletedAt)
 */

// ============================================================
// Request Types
// ============================================================

export interface SendMessageInput {
  room_id: string;
  content: string;
}

// ============================================================
// Response Types
// ============================================================

export interface ChatMessageResponse {
  id: number;
  room_id: string;
  sender_id: number | null;
  sender_username: string | null;
  sender_profile_photo_url: string | null;
  content: string;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface ChatMessageListResponse {
  items: ChatMessageResponse[];
  total: number;
  page: number;
  totalPages: number;
}

// ============================================================
// Socket.IO Event Types
// ============================================================

/**
 * V1 socket events (preserved):
 *   Client → Server: 'save-message' { text: string }
 *   Server → Client: 'message-saved' { id: number, text: string }
 *
 * V2 socket events (enhanced):
 *   Client → Server: 'send-message' { room_id: string, content: string }
 *   Server → Client: 'new-message' { ...ChatMessageResponse }
 *   Client → Server: 'join-room' { room_id: string }
 *   Server → Client: 'user-joined' { room_id: string, user_id: number }
 *   Client → Server: 'leave-room' { room_id: string }
 *   Server → Client: 'user-left' { room_id: number, user_id: number }
 *
 * V1 compatibility:
 *   Client → Server: 'save-message' { text: string } → treated as room 'general'
 *   Server → Client: 'message-saved' { id, text }
 */
