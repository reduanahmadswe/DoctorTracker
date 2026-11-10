import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PaginationMeta } from "@/types/api";
import { Button } from "./Button";

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
}

const ELLIPSIS = "ellipsis";
type PageItem = number | typeof ELLIPSIS;

// First, last and the neighbours of the current page; gaps collapse into an ellipsis.
const buildPageItems = (page: number, totalPages: number): PageItem[] => {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...pages].filter((value) => value >= 1 && value <= totalPages).sort((a, b) => a - b);
  return sorted.flatMap((value, index) => {
    const previous = sorted[index - 1];
    return previous !== undefined && value - previous > 1 ? [ELLIPSIS, value] : [value];
  });
};

export const Pagination = ({ meta, onPageChange, isFetching }: PaginationProps) => {
  const { page, limit, total, totalPages } = meta;
  if (total === 0) return null;

  const firstItem = (page - 1) * limit + 1;
  const lastItem = Math.min(page * limit, total);

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-3 md:flex-row"
    >
      <p className="text-sm text-text-muted" aria-live="polite">
        Showing <span className="font-medium text-text">{firstItem}</span>–
        <span className="font-medium text-text">{lastItem}</span> of{" "}
        <span className="font-medium text-text">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="size-9"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || isFetching}
          aria-label="Previous page"
        >
          <ChevronLeft aria-hidden className="size-4" />
        </Button>
        {buildPageItems(page, totalPages).map((item, index) =>
          item === ELLIPSIS ? (
            <span key={`gap-${index}`} aria-hidden className="px-1 text-text-muted">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              disabled={isFetching}
              aria-label={`Page ${item}`}
              aria-current={item === page ? "page" : undefined}
              className={cn(
                "size-9 rounded-control text-sm font-medium transition-colors",
                item === page ? "bg-primary text-white" : "text-text-muted hover:bg-primary-soft",
              )}
            >
              {item}
            </button>
          ),
        )}
        <Button
          variant="ghost"
          size="icon"
          className="size-9"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || isFetching}
          aria-label="Next page"
        >
          <ChevronRight aria-hidden className="size-4" />
        </Button>
      </div>
    </nav>
  );
};
