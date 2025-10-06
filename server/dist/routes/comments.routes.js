import { Router } from 'express';
import { getAllComments, postComment, toggleLike } from '../controllers/comments.controller.js';
export const CommentRoutes = Router();
CommentRoutes.get('/', getAllComments);
CommentRoutes.post('/', postComment);
CommentRoutes.post('/toggle-like', toggleLike);
//# sourceMappingURL=comments.routes.js.map