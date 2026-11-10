import { ApiError } from '../../utils/ApiError.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { AUTH_COOKIE_NAME, authCookieOptions, clearAuthCookieOptions } from './auth.cookie.js';
import type { LoginInput } from './auth.schemas.js';
import * as authService from './auth.service.js';

export const login = asyncHandler(async (_req, res) => {
  const { token, user } = await authService.login(res.locals.body as LoginInput);
  res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions);
  sendSuccess(res, user);
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME, clearAuthCookieOptions);
  sendSuccess(res, { loggedOut: true });
});

export const me = asyncHandler(async (req, res) => {
  if (!req.user) throw ApiError.unauthorized();
  sendSuccess(res, authService.toPublicUser(req.user));
});
