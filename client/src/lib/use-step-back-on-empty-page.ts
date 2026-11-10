"use client";

import { useEffect } from "react";

// Deleting the last row of a page leaves it empty: step back to the previous page.
// Returns true while that redirect is pending so the caller can avoid flashing an empty state.
export const useStepBackOnEmptyPage = (
  itemCount: number | undefined,
  page: number,
  changePage: (page: number) => void,
): boolean => {
  const isEmptyPage = itemCount === 0 && page > 1;

  useEffect(() => {
    if (isEmptyPage) changePage(page - 1);
  }, [isEmptyPage, page, changePage]);

  return isEmptyPage;
};
