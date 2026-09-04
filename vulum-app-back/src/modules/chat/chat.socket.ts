/**
 * Chat Socket.IO Handler
 *
 * Real-time messaging via Socket.IO.
 * Preserves V1 event contract while adding persistence and auth.
 *
 * V1 events:
 *   Client → Server: 'save-message' { text: string }
 *   Server → Client: 'message-saved' { id: number, text: string, ... }
 *
 * V2 events (backward compatible):
 *   Client → Server: 'save-message' { text: string }  (V1 compatible, room='general')
 *   Client → Server: 'send-message' { room_id: string, content: string }
 *   Server → Client: 'new-message' { ...ChatMessageResponse }
 *   Client → Server: 'join-room' { room_id: string }
 *   Server → Client: 'user-joined' { room_id: string, user_id: number }
 *   Client → Server: 'leave-room' { room_id: string }
 *   Server → Client: 'user-left' { room_id: string, user_id: number }
 *
 * JWT Authentication:
 *   - Token passed as query param: ?token=<jwt>
 *   - Verified on connection
 *   - Socket rejected if token is invalid
 *
 * V1 Compatibility:
 *   - 'save-message' with { text } → treated as room 'general'
 *   - Emits 'message-saved' with { id, text } for V1 client compatibility
 */

import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import * as chatService from './chat.service';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

interface AuthenticatedSocket extends Socket {
  userId?: number;
  email?: string;
  username?: string;
}

/**
 * Initialize Socket.IO handlers.
 * Called from server.ts after creating the HTTP server.
 */
export function initializeChatSocket(io: Server): void {
  // Authentication middleware for socket connections
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth?.token
      || socket.handshake.query?.token
      || socket.handshake.headers?.authorization?.replace('Bearer ', '');

    if (!token || typeof token !== 'string') {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: number;
        email: string;
        username?: string;
      };
      socket.userId = decoded.userId;
      socket.email = decoded.email;
      socket.username = decoded.username;
      next();
    } catch (err) {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`[Chat] User connected: ${socket.username || socket.userId} (socket: ${socket.id})`);

    // ============================================================
    // V1 Compatible: 'save-message' event
    // Client sends: { text: string }
    // Server emits: 'message-saved' { id, text, room_id, sender_id, ... }
    // ============================================================
    socket.on('save-message', async (data: { text: string }) => {
      try {
        if (!data?.text) {
          socket.emit('error', { message: 'Message text is required' });
          return;
        }

        const room = 'general'; // V1 had no rooms
        const message = await chatService.createMessage(
          room,
          socket.userId!,
          data.text
        );

        // V1 compatibility: emit 'message-saved' to the sender
        socket.emit('message-saved', {
          id: message.id,
          text: message.content,
          room_id: message.room_id,
          sender_id: message.sender_id,
          sender_username: message.sender_username,
          created_at: message.created_at,
        });

        // Also emit the V2 event to the room (includes sender)
        io.to(room).emit('new-message', message);
      } catch (error: any) {
        console.error('[Chat] save-message error:', error.message);
        socket.emit('error', { message: error.message || 'Failed to save message' });
      }
    });

    // ============================================================
    // V2: 'send-message' event
    // Client sends: { room_id: string, content: string }
    // Server emits: 'new-message' { ...ChatMessageResponse }
    // ============================================================
    socket.on('send-message', async (data: { room_id: string; content: string }) => {
      try {
        if (!data?.room_id || !data?.content) {
          socket.emit('error', { message: 'room_id and content are required' });
          return;
        }

        const message = await chatService.createMessage(
          data.room_id,
          socket.userId!,
          data.content
        );

        // Emit to all clients in the room (including sender)
        io.to(data.room_id).emit('new-message', message);
      } catch (error: any) {
        console.error('[Chat] send-message error:', error.message);
        socket.emit('error', { message: error.message || 'Failed to send message' });
      }
    });

    // ============================================================
    // V2: 'join-room' event
    // Client sends: { room_id: string }
    // Server emits: 'user-joined' to room
    // ============================================================
    socket.on('join-room', (data: { room_id: string }) => {
      if (!data?.room_id) {
        socket.emit('error', { message: 'room_id is required' });
        return;
      }

      socket.join(data.room_id);
      console.log(`[Chat] User ${socket.username || socket.userId} joined room: ${data.room_id}`);

      io.to(data.room_id).emit('user-joined', {
        room_id: data.room_id,
        user_id: socket.userId,
        username: socket.username,
      });
    });

    // ============================================================
    // V2: 'leave-room' event
    // Client sends: { room_id: string }
    // Server emits: 'user-left' to room
    // ============================================================
    socket.on('leave-room', (data: { room_id: string }) => {
      if (!data?.room_id) {
        socket.emit('error', { message: 'room_id is required' });
        return;
      }

      socket.leave(data.room_id);
      console.log(`[Chat] User ${socket.username || socket.userId} left room: ${data.room_id}`);

      // Emit to the leaving socket and remaining room members
      socket.emit('user-left', {
        room_id: data.room_id,
        user_id: socket.userId,
        username: socket.username,
      });
      io.to(data.room_id).emit('user-left', {
        room_id: data.room_id,
        user_id: socket.userId,
        username: socket.username,
      });
    });

    // ============================================================
    // Disconnect
    // ============================================================
    socket.on('disconnect', () => {
      console.log(`[Chat] User disconnected: ${socket.username || socket.userId} (socket: ${socket.id})`);
    });
  });
}
