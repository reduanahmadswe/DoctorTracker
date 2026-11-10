import { rateLimit } from 'express-rate-limit';
import { sendError } from '../utils/apiResponse.js';
import { MongoRateLimitStore } from './mongoRateLimitStore.js';

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;
const MAX_EMAIL_LENGTH = 254;

const sharedOptions = {
  windowMs: LOGIN_WINDOW_MS,
  limit: MAX_LOGIN_ATTEMPTS,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req: unknown, res: Parameters<typeof sendError>[0]) =>
    sendError(res, 429, 'Too many login attempts. Please try again in 15 minutes.'),
} as const;

// Per client address (in memory: fast, but each serverless instance counts on its own).
export const loginRateLimiter = rateLimit({ ...sharedOptions });

const emailOf = (body: unknown): string | undefined => {
  const email = (body as { email?: unknown } | undefined)?.email;
  return typeof email === 'string'
    ? email.trim().toLowerCase().slice(0, MAX_EMAIL_LENGTH)
    : undefined;
};

// Per account, counted in MongoDB so every instance shares it. This is what holds up behind a proxy
// (Vercel hides the visitor's IP) and against attempts spread over many addresses. If the store is
// unreachable the request is allowed rather than blocking every login.
export const loginAccountLimiter = rateLimit({
  ...sharedOptions,
  store: new MongoRateLimitStore(),
  passOnStoreError: true,
  keyGenerator: (req) => `login:${emailOf(req.body) ?? 'unknown'}`,
});
