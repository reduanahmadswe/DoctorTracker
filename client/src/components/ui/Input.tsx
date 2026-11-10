import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "@/lib/utils";
import { controlClassName, FormField } from "./FormField";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  endAdornment?: ReactNode;
  ref?: Ref<HTMLInputElement>;
}

export const Input = ({ id, label, error, hint, className, endAdornment, ref, ...props }: InputProps) => (
  <FormField id={id} label={label} error={error} hint={hint} className={className}>
    <div className="relative">
      <input
        id={id}
        ref={ref}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(controlClassName(Boolean(error)), endAdornment && "pr-11")}
        {...props}
      />
      {endAdornment && (
        <div className="absolute top-1/2 right-1 -translate-y-1/2">{endAdornment}</div>
      )}
    </div>
  </FormField>
);
