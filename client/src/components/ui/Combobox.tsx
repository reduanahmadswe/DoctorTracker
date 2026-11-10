"use client";

import { Check, ChevronDown } from "lucide-react";
import { type KeyboardEvent, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { controlClassName, FormField } from "./FormField";

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
}

interface ComboboxProps {
  id: string;
  label: string;
  options: readonly ComboboxOption[];
  value: string;
  onChange: (value: string, option: ComboboxOption) => void;
  // Label of the selected value when it is not among `options` (e.g. beyond the loaded page).
  selectedLabel?: string;
  placeholder?: string;
  // Adds a first entry that resets the value to "" (used by filters).
  emptyOptionLabel?: string;
  loading?: boolean;
  // Called with the typed text, so the parent can fetch matching options from the server.
  onQueryChange?: (query: string) => void;
  // Set to false when the options are already filtered by the server.
  filterLocally?: boolean;
  error?: string;
  className?: string;
}

const matches = (option: ComboboxOption, query: string): boolean =>
  `${option.label} ${option.description ?? ""}`.toLowerCase().includes(query.toLowerCase());

// Accessible searchable select (WAI-ARIA combobox with a listbox popup).
export const Combobox = ({
  id,
  label,
  options,
  value,
  onChange,
  selectedLabel,
  placeholder = "Select...",
  emptyOptionLabel,
  loading,
  onQueryChange,
  filterLocally = true,
  error,
  className,
}: ComboboxProps) => {
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const items = useMemo<ComboboxOption[]>(() => {
    const filtered = filterLocally
      ? options.filter((option) => matches(option, query.trim()))
      : [...options];
    return emptyOptionLabel && !query ? [{ value: "", label: emptyOptionLabel }, ...filtered] : filtered;
  }, [emptyOptionLabel, filterLocally, options, query]);

  const selected = options.find((option) => option.value === value);
  const displayLabel = selected?.label ?? (value ? selectedLabel : undefined) ?? "";

  const updateQuery = (next: string) => {
    setQuery(next);
    onQueryChange?.(next);
  };

  const close = () => {
    setOpen(false);
    updateQuery("");
  };

  const choose = (option: ComboboxOption) => {
    onChange(option.value, option);
    close();
    inputRef.current?.blur();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((current) => (current + step + items.length) % Math.max(items.length, 1));
    } else if (event.key === "Enter" && open) {
      event.preventDefault();
      const option = items[activeIndex];
      if (option) choose(option);
    } else if (event.key === "Escape" && open) {
      event.stopPropagation();
      close();
    }
  };

  return (
    <FormField id={id} label={label} error={error} className={className}>
      <div className="relative">
        <input
          id={id}
          ref={inputRef}
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={open && items[activeIndex] ? `${listboxId}-${activeIndex}` : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          autoComplete="off"
          value={open ? query : displayLabel}
          placeholder={displayLabel || placeholder}
          onChange={(event) => {
            updateQuery(event.target.value);
            setActiveIndex(0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={close}
          onKeyDown={handleKeyDown}
          className={cn(
            controlClassName(Boolean(error)),
            "pr-9",
            !open && displayLabel && "text-text",
            open && displayLabel && "placeholder:text-text",
          )}
        />
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-text-muted"
        />
        {open && (
          <ul
            id={listboxId}
            role="listbox"
            aria-label={label}
            className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-control border border-border bg-surface py-1 shadow-overlay"
          >
            {loading && <li className="px-3 py-2 text-sm text-text-muted">Loading...</li>}
            {!loading && items.length === 0 && (
              <li className="px-3 py-2 text-sm text-text-muted">No matches found</li>
            )}
            {items.map((option, index) => (
              <li
                key={option.value || "__empty"}
                id={`${listboxId}-${index}`}
                role="option"
                aria-selected={option.value === value}
                // mousedown keeps focus on the input so onBlur does not close the list first.
                onMouseDown={(event) => {
                  event.preventDefault();
                  choose(option);
                }}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm",
                  index === activeIndex ? "bg-primary-soft" : "bg-surface",
                )}
              >
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-text">{option.label}</span>
                  {option.description && (
                    <span className="truncate text-xs text-text-muted">{option.description}</span>
                  )}
                </span>
                {option.value === value && <Check aria-hidden className="size-4 shrink-0 text-primary" />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </FormField>
  );
};
