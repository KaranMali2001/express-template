import { getCurrentUser, login, logout } from '@/controllers/user.Controller';
import { authMiddleware } from '@/middleware/auth.middleware';
import { zodMiddleware } from '@/middleware/zod.middleware';
import { loginRequestSchema } from '@/type/user.type';
import { Router } from 'express';

export const userRouter = Router();
userRouter.post('/login', zodMiddleware(loginRequestSchema), login);

userRouter.use(authMiddleware);
userRouter.get('/', getCurrentUser);

userRouter.get('/logout', logout);
