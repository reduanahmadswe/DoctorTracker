import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  secondary: "border border-border bg-surface text-text hover:bg-primary-soft",
  ghost: "text-text-muted hover:bg-primary-soft hover:text-text",
  danger: "bg-danger text-white hover:bg-danger-text",
} as const;

const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  icon: "size-10",
} as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  loading?: boolean;
}

export const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) => (
  <button
    type={type}
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-control font-medium transition-colors",
      "disabled:cursor-not-allowed disabled:opacity-60",
      variants[variant],
      sizes[size],
      className,
    )}
    {...props}
  >
    {loading && <Loader2 aria-hidden className="size-4 animate-spin" />}
    {children}
  </button>
);
