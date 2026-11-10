import { Router } from 'express';
import { authRouter } from '../modules/auth/auth.routes.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  sendSuccess(res, { status: 'ok' });
});

apiRouter.use('/auth', authRouter);
