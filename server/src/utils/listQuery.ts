import { buildCreatedAtFilter } from './dateRange.js';
import { buildKeywordFilter } from './searchKeywords.js';

// Newest first; served by the {createdAt: -1} index and the compound indexes that end in it.
export const LIST_SORT = { createdAt: -1 } as const;

// Shared pieces of the search + date-range logic used by every paginated list.
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
    ...(q && buildKeywordFilter(q)),
    ...(createdAt && { createdAt }),
  };
};
