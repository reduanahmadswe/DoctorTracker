import type { RequestHandler } from 'express';
import { AUTH_COOKIE_NAME } from '../modules/auth/auth.cookie.js';
import { verifyToken } from '../modules/auth/token.js';
import { UserModel } from '../modules/auth/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const SESSION_INVALID_MESSAGE = 'Invalid or expired session';

export const authenticate: RequestHandler = asyncHandler(async (req, _res, next) => {
  const token: unknown = req.cookies?.[AUTH_COOKIE_NAME];
  if (typeof token !== 'string' || token === '') throw ApiError.unauthorized();

  let userId: string;
  try {
    userId = verifyToken(token).sub;
  } catch {
    throw ApiError.unauthorized(SESSION_INVALID_MESSAGE);
  }

  const user = await UserModel.findById(userId).select('name email role').lean();
  if (!user) throw ApiError.unauthorized(SESSION_INVALID_MESSAGE);

  req.user = user;
  next();
});
