import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./Card";
import { EmptyState } from "./EmptyState";

interface ChartCardProps {
  title: string;
  description: string;
  isEmpty: boolean;
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
  // Dims the chart while the next range loads, so the layout does not jump.
  isRefreshing?: boolean;
  className?: string;
  children: ReactNode;
}

export const ChartCard = ({
  title,
  description,
  isEmpty,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  isRefreshing,
  className,
  children,
}: ChartCardProps) => (
  <Card className={className}>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="p-4 pt-4 sm:p-6">
      {isEmpty ? (
        <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
      ) : (
        <div aria-busy={isRefreshing} className={cn("transition-opacity", isRefreshing && "opacity-60")}>
          {children}
        </div>
      )}
    </CardContent>
  </Card>
);
