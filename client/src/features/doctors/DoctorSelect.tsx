"use client";

import { useMemo } from "react";
import { Combobox } from "@/components/ui/Combobox";
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
  const { data: doctors, isPending } = useDoctorSelectOptions();

  const options = useMemo(
    () =>
      (doctors ?? []).map((doctor) => ({
        value: doctor.id,
        label: doctor.name,
        description: `${doctor.specialization} · ${doctor.hospital}`,
      })),
    [doctors],
  );

  // A selected doctor outside the loaded options (e.g. from a shared URL) is looked up by id.
  const isListed = options.some((option) => option.value === value);
  const needsLookup = Boolean(value) && !isPending && !isListed && !selectedLabel;
  const { data: lookedUp } = useDoctor(value, needsLookup);

  return (
    <Combobox
      id={id}
      label={label}
      options={options}
      value={value}
      onChange={onChange}
      selectedLabel={selectedLabel ?? lookedUp?.name}
      placeholder="Search doctors"
      emptyOptionLabel={emptyOptionLabel}
      loading={isPending}
      error={error}
      className={className}
    />
  );
};
