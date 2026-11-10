import type { SortOrder } from 'mongoose';
import { buildCreatedAtFilter } from './dateRange.js';

type ListSort = Record<string, SortOrder | { $meta: 'textScore' }>;

// Shared pieces of the search + date-range + sort logic used by every paginated list.
export const buildSearchAndDateFilter = ({
  q,
  from,
  to,
}: {
  q?: string;
  from?: string;
  to?: string;
}) => {
  const createdAt = buildCreatedAtFilter({ from, to });
  return {
    ...(q && { $text: { $search: q } }),
    ...(createdAt && { createdAt }),
  };
};

export const buildTextScoreProjection = (q?: string) =>
  q ? { score: { $meta: 'textScore' as const } } : undefined;

// Best text match first when searching, otherwise newest first.
export const buildListSort = (q?: string): ListSort =>
  q ? { score: { $meta: 'textScore' }, createdAt: -1 } : { createdAt: -1 };
