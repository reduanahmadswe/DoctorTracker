"use client";

import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SEARCH_DEBOUNCE_MS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onSearch: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

// Keeps typing instant locally and only reports the value after the user pauses.
export const SearchInput = ({
  value,
  onSearch,
  label = "Search",
  placeholder = "Search...",
  className,
}: SearchInputProps) => {
  const [draft, setDraft] = useState(value);
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // Follow external changes (e.g. "clear filters" or browser back) without an effect.
  const [syncedValue, setSyncedValue] = useState(value);
  if (value !== syncedValue) {
    setSyncedValue(value);
    setDraft(value);
  }

  useEffect(() => {
    if (draft === value) return;
    const timer = window.setTimeout(() => onSearchRef.current(draft.trim()), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [draft, value]);

  return (
    <div className={cn("relative", className)}>
      <label htmlFor="search-input" className="sr-only">
        {label}
      </label>
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-muted"
      />
      <input
        id="search-input"
        type="search"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-control border border-border bg-surface pr-3 pl-9 text-sm text-text placeholder:text-text-muted hover:border-text-muted"
      />
    </div>
  );
};
