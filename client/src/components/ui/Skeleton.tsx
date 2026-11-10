import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Skeleton = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    aria-hidden
    className={cn("animate-pulse rounded-control bg-border/70", className)}
    {...props}
  />
);

interface TableSkeletonProps {
  rows?: number;
  columns: number;
}

export const TableSkeleton = ({ rows = 5, columns }: TableSkeletonProps) => (
  <div role="status" aria-label="Loading" className="flex flex-col gap-3 p-4">
    {Array.from({ length: rows }, (_, row) => (
      <div
        key={row}
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: columns }, (_, column) => (
          <Skeleton key={column} className="h-5" />
        ))}
      </div>
    ))}
  </div>
);
