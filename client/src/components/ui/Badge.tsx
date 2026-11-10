import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variants = {
  success: "bg-success-soft text-success-text",
  info: "bg-info-soft text-info-text",
  danger: "bg-danger-soft text-danger-text",
  warning: "bg-warning-soft text-warning-text",
  primary: "bg-primary-soft text-primary-hover",
  neutral: "bg-background text-text-muted",
} as const;

export type BadgeVariant = keyof typeof variants;

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge = ({ variant = "neutral", className, ...props }: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
      variants[variant],
      className,
    )}
    {...props}
  />
);
