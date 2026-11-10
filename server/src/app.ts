import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import { ensureDatabase } from './config/db.js';
import { env } from './config/env.js';
import { apiRateLimiter } from './middlewares/apiRateLimiter.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';
import { sanitizeInput } from './middlewares/sanitizeInput.js';
import { apiRouter } from './routes/index.js';
import { ApiError } from './utils/ApiError.js';

export const app = express();

app.disable('x-powered-by');
app.set('trust proxy', env.TRUST_PROXY);
app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(sanitizeInput);
app.use(hpp());

// Serverless platforms import this module and call it per request without running server.ts, so
// the database connection is opened on demand (a no-op once it is open).
app.use(async (_req, _res, next) => {
  try {
    await ensureDatabase();
    next();
  } catch {
    next(ApiError.unavailable());
  }
});

app.use('/api/v1', apiRateLimiter, apiRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
