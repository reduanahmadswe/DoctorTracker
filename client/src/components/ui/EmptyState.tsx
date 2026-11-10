import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = ({ icon: Icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
    <div className="flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary">
      <Icon aria-hidden className="size-6" />
    </div>
    <div className="flex flex-col gap-1">
      <h3 className="text-base font-semibold text-text">{title}</h3>
      {description && <p className="max-w-sm text-sm text-text-muted">{description}</p>}
    </div>
    {action}
  </div>
);
