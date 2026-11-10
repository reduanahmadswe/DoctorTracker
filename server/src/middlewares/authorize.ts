import type { RequestHandler } from 'express';
import type { UserRole } from '../modules/auth/user.model.js';
import { ApiError } from '../utils/ApiError.js';

export const authorize =
  (...roles: UserRole[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role)) return next(ApiError.forbidden());
    next();
  };
