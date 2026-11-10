import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

type RequestPart = 'body' | 'query' | 'params';

// Validated values are stored on res.locals because req.query is read-only in Express 5.
export const validate =
  (part: RequestPart, schema: ZodType): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req[part]);
    if (!result.success) return next(result.error);
    res.locals[part] = result.data;
    next();
  };
