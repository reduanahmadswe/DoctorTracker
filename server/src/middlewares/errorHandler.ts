import type { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { isProduction } from '../config/env.js';
import { ApiError, type FieldError } from '../utils/ApiError.js';
import { sendError } from '../utils/apiResponse.js';

const DUPLICATE_KEY_CODE = 11000;

const isDuplicateKeyError = (error: unknown): error is { code: number; keyValue?: object } =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  error.code === DUPLICATE_KEY_CODE;

const formatZodErrors = (error: ZodError): FieldError[] =>
  error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message }));

export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, next) => {
  if (res.headersSent) return next(error);

  if (error instanceof ApiError) {
    return sendError(res, error.statusCode, error.message, error.errors);
  }
  if (error instanceof ZodError) {
    return sendError(res, 400, 'Validation failed', formatZodErrors(error));
  }
  if (error instanceof mongoose.Error.CastError) {
    return sendError(res, 400, `Invalid value for ${error.path}`);
  }
  if (isDuplicateKeyError(error)) {
    const fields = Object.keys(error.keyValue ?? {}).join(', ');
    return sendError(res, 409, fields ? `Duplicate value for: ${fields}` : 'Duplicate value');
  }

  const detail = error instanceof Error ? error.message : 'Unknown error';
  process.stderr.write(
    `Unhandled error: ${error instanceof Error ? (error.stack ?? detail) : detail}\n`,
  );
  return sendError(res, 500, isProduction ? 'Internal server error' : detail);
};
