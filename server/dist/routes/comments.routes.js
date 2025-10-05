import { Router } from 'express';
import { getAllComments, postComment, toggleLike } from '../controllers/comments.controller.js';
export const CommentRoutes = Router();
CommentRoutes.get('/', getAllComments); // GET /api/comments
CommentRoutes.post('/', postComment); // POST /api/comments
CommentRoutes.post('/toggle-like', toggleLike); // POST /api/comments/toggle-like
//# sourceMappingURL=comments.routes.js.map