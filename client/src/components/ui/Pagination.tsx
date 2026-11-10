import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationMeta } from "@/types/api";
import { Button } from "./Button";

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
}

export const Pagination = ({ meta, onPageChange, isFetching }: PaginationProps) => {
  const { page, limit, total, totalPages } = meta;
  if (total === 0) return null;

  const firstItem = (page - 1) * limit + 1;
  const lastItem = Math.min(page * limit, total);

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-3 sm:flex-row"
    >
      <p className="text-sm text-text-muted" aria-live="polite">
        Showing <span className="font-medium text-text">{firstItem}</span> to{" "}
        <span className="font-medium text-text">{lastItem}</span> of{" "}
        <span className="font-medium text-text">{total}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || isFetching}
          aria-label="Previous page"
        >
          <ChevronLeft aria-hidden className="size-4" />
          Previous
        </Button>
        <span className="px-2 text-sm text-text-muted">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || isFetching}
          aria-label="Next page"
        >
          Next
          <ChevronRight aria-hidden className="size-4" />
        </Button>
      </div>
    </nav>
  );
};
