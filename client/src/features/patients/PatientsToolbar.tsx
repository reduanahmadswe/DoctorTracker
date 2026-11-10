"use client";

import { FilterX } from "lucide-react";
import { memo } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { DateRangeFilter } from "@/components/ui/DateRangeFilter";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { DoctorSelect } from "@/features/doctors/DoctorSelect";
import { PATIENT_CONDITIONS } from "@/lib/constants";
import type { PatientListFilters } from "./patients.types";

type FilterUpdates = Partial<Omit<PatientListFilters, "page">>;

interface PatientsToolbarProps {
  filters: PatientListFilters;
  hasActiveFilters: boolean;
  onChange: (updates: FilterUpdates) => void;
  onClear: () => void;
}

const CONDITION_OPTIONS = PATIENT_CONDITIONS.map((condition) => ({
  value: condition,
  label: condition,
}));

const PatientsToolbarComponent = ({
  filters,
  hasActiveFilters,
  onChange,
  onClear,
}: PatientsToolbarProps) => (
  <Card>
    <CardContent className="flex flex-col gap-4 p-4 sm:p-6">
      <SearchInput
        value={filters.q}
        onSearch={(q) => onChange({ q })}
        label="Search patients"
        placeholder="Search by patient name or phone"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Select
          id="filter-condition"
          label="Condition"
          placeholder="All conditions"
          options={CONDITION_OPTIONS}
          value={filters.condition}
          onChange={(event) => onChange({ condition: event.target.value })}
        />
        <DoctorSelect
          id="filter-doctor"
          label="Doctor"
          value={filters.doctor}
          emptyOptionLabel="All doctors"
          onChange={(doctor) => onChange({ doctor })}
        />
        <div className="grid grid-cols-2 gap-4 sm:col-span-2">
          <DateRangeFilter
            from={filters.from}
            to={filters.to}
            onChange={({ from, to }) => onChange({ from, to })}
          />
        </div>
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

export const PatientsToolbar = memo(PatientsToolbarComponent);
