"use client";

import { useCallback, useMemo } from "react";
import { parsePageParam, useUrlParams } from "./use-url-params";

type ListState<K extends string> = Record<K, string> & { page: number };

// Shared by every paginated list (doctors, patients): reads the filters and page from the URL
// and exposes stable handlers that keep the URL as the single source of truth.
export const useListParams = <K extends string>(filterKeys: readonly K[]) => {
  const { searchParams, update } = useUrlParams();

  const filters = useMemo(() => {
    const values = Object.fromEntries(filterKeys.map((key) => [key, searchParams.get(key) ?? ""]));
    return { ...values, page: parsePageParam(searchParams.get("page")) } as ListState<K>;
  }, [filterKeys, searchParams]);

  const hasActiveFilters = filterKeys.some((key) => filters[key] !== "");

  // Changing a filter changes the result set, so the list goes back to page 1.
  const changeFilters = useCallback(
    (updates: Partial<Record<K, string>>) => update(updates, { resetPage: true }),
    [update],
  );
  const clearFilters = useCallback(
    () =>
      update(Object.fromEntries(filterKeys.map((key) => [key, ""])), { resetPage: true }),
    [filterKeys, update],
  );
  const changePage = useCallback((page: number) => update({ page }), [update]);

  return {
    filters,
    hasActiveFilters,
    changeFilters,
    clearFilters,
    changePage,
    // Raw query string, passed to detail pages so "Back" restores the same view.
    queryString: searchParams.toString(),
  };
};
