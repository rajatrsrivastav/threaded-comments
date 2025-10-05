import express from 'express';
import { googleAuth } from '../controllers/auth.controller.js';
export const AuthRoutes = express.Router();
// POST /api/auth/google - Handle Google sign-in
AuthRoutes.post('/google', googleAuth);
//# sourceMappingURL=auth.routes.js.map