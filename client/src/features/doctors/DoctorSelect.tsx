"use client";

import { useCallback, useMemo, useState } from "react";
import { Combobox, type ComboboxOption } from "@/components/ui/Combobox";
import { SEARCH_DEBOUNCE_MS } from "@/lib/constants";
import { useDebouncedValue } from "@/lib/use-debounced-value";
import { useDoctor, useDoctorSelectOptions } from "./useDoctorQueries";

interface DoctorSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (doctorId: string) => void;
  // Adds an "all doctors" entry that clears the value (filters only).
  emptyOptionLabel?: string;
  selectedLabel?: string;
  error?: string;
  className?: string;
}

export const DoctorSelect = ({
  id,
  label,
  value,
  onChange,
  emptyOptionLabel,
  selectedLabel,
  error,
  className,
}: DoctorSelectProps) => {
  const [typed, setTyped] = useState("");
  const search = useDebouncedValue(typed.trim(), SEARCH_DEBOUNCE_MS);
  const { data: doctors, isFetching } = useDoctorSelectOptions(search);
  // Remembers the name of the picked doctor, which may not be in the current search results.
  const [pickedLabel, setPickedLabel] = useState<{ id: string; label: string } | null>(null);

  const options = useMemo(
    () =>
      (doctors ?? []).map((doctor) => ({
        value: doctor.id,
        label: doctor.name,
        description: `${doctor.specialization} · ${doctor.hospital}`,
      })),
    [doctors],
  );

  const knownLabel =
    selectedLabel ?? (pickedLabel?.id === value ? pickedLabel.label : undefined);
  // A value from a shared URL has no name yet: look the doctor up by id.
  const { data: lookedUp } = useDoctor(value, Boolean(value) && !knownLabel);

  const handleChange = useCallback(
    (doctorId: string, option: ComboboxOption) => {
      setPickedLabel({ id: doctorId, label: option.label });
      onChange(doctorId);
    },
    [onChange],
  );

  return (
    <Combobox
      id={id}
      label={label}
      options={options}
      value={value}
      onChange={handleChange}
      onQueryChange={setTyped}
      filterLocally={false}
      selectedLabel={knownLabel ?? lookedUp?.name}
      placeholder="Search doctors"
      emptyOptionLabel={emptyOptionLabel}
      loading={isFetching}
      error={error}
      className={className}
    />
  );
};
