import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';
import { loginAccountLimiter, loginRateLimiter } from '../../middlewares/loginRateLimiter.js';
import { validate } from '../../middlewares/validate.js';
import * as authController from './auth.controller.js';
import { loginSchema } from './auth.schemas.js';

export const authRouter = Router();

authRouter.post(
  '/login',
  loginRateLimiter,
  loginAccountLimiter,
  validate('body', loginSchema),
  authController.login,
);
authRouter.post('/logout', authController.logout);
authRouter.get('/me', authenticate, authorize('admin'), authController.me);
