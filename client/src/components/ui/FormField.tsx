import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}

// Shared label + error wrapper so every control is labelled and announces its error.
export const FormField = ({ id, label, error, hint, className, children }: FormFieldProps) => (
  <div className={cn("flex flex-col gap-1.5", className)}>
    <label htmlFor={id} className="text-sm font-medium text-text">
      {label}
    </label>
    {children}
    {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
    {error && (
      <p id={`${id}-error`} role="alert" className="text-xs text-danger-text">
        {error}
      </p>
    )}
  </div>
);

export const controlClassName = (hasError?: boolean): string =>
  cn(
    "h-10 w-full rounded-control border bg-surface px-3 text-sm text-text placeholder:text-text-muted",
    "transition-colors disabled:cursor-not-allowed disabled:bg-background",
    hasError ? "border-danger" : "border-border hover:border-text-muted",
  );
