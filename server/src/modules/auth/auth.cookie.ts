import type { CookieOptions } from 'express';
import { isProduction } from '../../config/env.js';
import { TOKEN_MAX_AGE_MS } from './token.js';

export const AUTH_COOKIE_NAME = 'token';

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax',
  path: '/',
};

export const authCookieOptions: CookieOptions = { ...baseCookieOptions, maxAge: TOKEN_MAX_AGE_MS };
export const clearAuthCookieOptions: CookieOptions = baseCookieOptions;
