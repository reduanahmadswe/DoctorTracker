import type { RequestListener } from 'node:http';
import { app } from './app.js';
import { connectDatabase } from './config/db.js';

// Serverless entry point (Vercel). The database connection is opened once per warm instance and
// reused by later invocations; a failed attempt is forgotten so the next request retries.
let databaseReady: Promise<void> | undefined;

const ensureDatabase = (): Promise<void> => {
  databaseReady ??= connectDatabase().catch((error: unknown) => {
    databaseReady = undefined;
    throw error;
  });
  return databaseReady;
};

const handler: RequestListener = async (req, res) => {
  try {
    await ensureDatabase();
  } catch {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, message: 'Service temporarily unavailable' }));
    return;
  }
  app(req, res);
};

export default handler;
