import type { Response } from 'express';
import type { FieldError } from './ApiError.js';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  options: { status?: number; meta?: PaginationMeta } = {},
): void => {
  const { status = 200, meta } = options;
  res.status(status).json({ success: true, data, ...(meta && { meta }) });
};

export const sendError = (
  res: Response,
  status: number,
  message: string,
  errors?: FieldError[],
): void => {
  res.status(status).json({ success: false, message, ...(errors && { errors }) });
};
