"use client";

import { FilterX } from "lucide-react";
import { memo } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { DateRangeFilter } from "@/components/ui/DateRangeFilter";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import type { DoctorFilterOptions, DoctorListFilters } from "./doctors.types";

type FilterUpdates = Partial<Omit<DoctorListFilters, "page">>;

interface DoctorsToolbarProps {
  filters: DoctorListFilters;
  options?: DoctorFilterOptions;
  hasActiveFilters: boolean;
  onChange: (updates: FilterUpdates) => void;
  onClear: () => void;
}

const toOptions = (values: string[] = []) => values.map((value) => ({ value, label: value }));

const DoctorsToolbarComponent = ({
  filters,
  options,
  hasActiveFilters,
  onChange,
  onClear,
}: DoctorsToolbarProps) => (
  <Card>
    <CardContent className="flex flex-col gap-4 p-4 sm:p-6">
      <SearchInput
        value={filters.q}
        onSearch={(q) => onChange({ q })}
        label="Search doctors"
        placeholder="Search by name, specialization, hospital or email"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Select
          id="filter-specialization"
          label="Specialization"
          placeholder="All specializations"
          options={toOptions(options?.specializations)}
          value={filters.specialization}
          onChange={(event) => onChange({ specialization: event.target.value })}
        />
        <Select
          id="filter-hospital"
          label="Hospital"
          placeholder="All hospitals"
          options={toOptions(options?.hospitals)}
          value={filters.hospital}
          onChange={(event) => onChange({ hospital: event.target.value })}
        />
        <DateRangeFilter
          from={filters.from}
          to={filters.to}
          onChange={({ from, to }) => onChange({ from, to })}
        />
      </div>
      {hasActiveFilters && (
        <div>
          <Button variant="ghost" size="sm" onClick={onClear}>
            <FilterX aria-hidden className="size-4" />
            Clear filters
          </Button>
        </div>
      )}
    </CardContent>
  </Card>
);

export const DoctorsToolbar = memo(DoctorsToolbarComponent);
