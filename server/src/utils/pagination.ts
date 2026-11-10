import { z } from 'zod';
import type { PaginationMeta } from './apiResponse.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1).max(MAX_LIMIT).default(DEFAULT_LIMIT),
});

export type PageRequest = z.infer<typeof paginationQuerySchema>;

export const toSkip = ({ page, limit }: PageRequest): number => (page - 1) * limit;

export const buildPaginationMeta = (
  { page, limit }: PageRequest,
  total: number,
): PaginationMeta => ({ page, limit, total, totalPages: Math.ceil(total / limit) });
