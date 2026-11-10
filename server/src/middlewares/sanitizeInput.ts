import type { RequestHandler } from 'express';

// Express 5 makes req.query a getter, so express-mongo-sanitize cannot be used;
// this strips keys starting with "$" or containing "." in place instead.
const isUnsafeKey = (key: string): boolean => key.startsWith('$') || key.includes('.');

const sanitizeInPlace = (value: unknown): void => {
  if (typeof value !== 'object' || value === null) return;
  const record = value as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (isUnsafeKey(key)) {
      delete record[key];
      continue;
    }
    sanitizeInPlace(record[key]);
  }
};

export const sanitizeInput: RequestHandler = (req, _res, next) => {
  sanitizeInPlace(req.body);
  sanitizeInPlace(req.query);
  sanitizeInPlace(req.params);
  next();
};
