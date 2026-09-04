/**
 * Chat Routes (REST)
 *
 * REST endpoints for chat message history and management.
 * Real-time messaging is handled by Socket.IO (see chat.socket.ts).
 *
 * V1 had NO REST endpoints — only Socket.IO.
 * V2 adds REST endpoints for:
 *   - Fetching message history
 *   - Fetching a single message
 *   - Deleting a message (soft delete)
 *
 * Endpoints:
 *   GET    /chat/messages/:roomId        (authenticated) — paginated messages for a room
 *   GET    /chat/messages/:roomId/:id    (authenticated) — single message
 *   DELETE /chat/messages/:id            (authenticated) — soft delete own message
 *
 * Authentication required for all endpoints.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../shared/middleware/authenticate';
import { NotFoundError } from '../../shared/errors';
import * as chatService from './chat.service';

const router = Router();

// GET /chat/messages/:roomId
// Paginated messages for a room
router.get(
  '/chat/messages/:roomId',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { roomId } = req.params;
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 50;
      const result = await chatService.getMessagesByRoom(roomId, page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// GET /chat/messages/:roomId/:id
// Single message
router.get(
  '/chat/messages/:roomId/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (!id || isNaN(id)) {
        throw new NotFoundError('Chat message', req.params.id);
      }
      const result = await chatService.getMessageById(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /chat/messages/:id
// Soft delete own message
router.delete(
  '/chat/messages/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (!id || isNaN(id)) {
        throw new NotFoundError('Chat message', req.params.id);
      }
      await chatService.softDeleteMessage(id, req.user!.userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
