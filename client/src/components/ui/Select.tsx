import type { Ref, SelectHTMLAttributes } from "react";
import { controlClassName, FormField } from "./FormField";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  options: readonly SelectOption[];
  placeholder?: string;
  error?: string;
  ref?: Ref<HTMLSelectElement>;
}

export const Select = ({
  id,
  label,
  options,
  placeholder,
  error,
  className,
  ref,
  ...props
}: SelectProps) => (
  <FormField id={id} label={label} error={error} className={className}>
    <select
      id={id}
      ref={ref}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      className={controlClassName(Boolean(error))}
      {...props}
    >
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </FormField>
);
