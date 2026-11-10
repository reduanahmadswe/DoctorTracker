"use client";

import { Input } from "./Input";

interface DateRangeFilterProps {
  from: string;
  to: string;
  onChange: (range: { from: string; to: string }) => void;
  idPrefix?: string;
}

export const DateRangeFilter = ({ from, to, onChange, idPrefix = "created" }: DateRangeFilterProps) => (
  <>
    <Input
      id={`${idPrefix}-from`}
      type="date"
      label="Created from"
      value={from}
      max={to || undefined}
      onChange={(event) => onChange({ from: event.target.value, to })}
    />
    <Input
      id={`${idPrefix}-to`}
      type="date"
      label="Created to"
      value={to}
      min={from || undefined}
      onChange={(event) => onChange({ from, to: event.target.value })}
    />
  </>
);
