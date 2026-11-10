import jwt, { type SignOptions } from 'jsonwebtoken';
import ms, { type StringValue } from 'ms';
import { z } from 'zod';
import { env } from '../../config/env.js';
import { USER_ROLES, type UserRole } from './user.model.js';

const tokenPayloadSchema = z.object({ sub: z.string().min(1), role: z.enum(USER_ROLES) });

export const TOKEN_MAX_AGE_MS = ms(env.JWT_EXPIRES_IN as StringValue);

export const signToken = (userId: string, role: UserRole): string =>
  jwt.sign({ role }, env.JWT_SECRET, {
    subject: userId,
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  });

export const verifyToken = (token: string): { sub: string; role: UserRole } =>
  tokenPayloadSchema.parse(jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] }));
