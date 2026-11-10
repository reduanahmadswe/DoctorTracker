import { rateLimit } from 'express-rate-limit';
import { sendError } from '../utils/apiResponse.js';

const API_WINDOW_MS = 15 * 60 * 1000;
const MAX_API_REQUESTS = 600;

// Broad per-IP ceiling for the whole API; the login route has its own much stricter limiter.
export const apiRateLimiter = rateLimit({
  windowMs: API_WINDOW_MS,
  limit: MAX_API_REQUESTS,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req, res) => sendError(res, 429, 'Too many requests. Please slow down and try again.'),
});
