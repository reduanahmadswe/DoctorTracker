import type { InputHTMLAttributes, Ref } from "react";
import { cn } from "@/lib/utils";
import { controlClassName, FormField } from "./FormField";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  ref?: Ref<HTMLInputElement>;
}

export const Input = ({ id, label, error, hint, className, ref, ...props }: InputProps) => (
  <FormField id={id} label={label} error={error} hint={hint} className={className}>
    <input
      id={id}
      ref={ref}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      className={cn(controlClassName(Boolean(error)))}
      {...props}
    />
  </FormField>
);
