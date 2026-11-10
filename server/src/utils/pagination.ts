import { z } from 'zod';
import type { PaginationMeta } from './apiResponse.js';

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 50;

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1).max(MAX_LIMIT).default(DEFAULT_LIMIT),
});

export interface Pagination {
  page: number;
  limit: number;
  skip: number;
}

export const getPagination = (query: unknown): Pagination => {
  const { page, limit } = paginationQuerySchema.parse(query);
  return { page, limit, skip: (page - 1) * limit };
};

export const buildPaginationMeta = (
  { page, limit }: Pick<Pagination, 'page' | 'limit'>,
  total: number,
): PaginationMeta => ({ page, limit, total, totalPages: Math.ceil(total / limit) });
