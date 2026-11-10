"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPatients, patientKeys } from "./patients.api";
import type { PatientListFilters } from "./patients.types";

// placeholderData keeps the previous page on screen while the next one loads.
export const usePatients = (filters: PatientListFilters) =>
  useQuery({
    queryKey: patientKeys.list(filters),
    queryFn: ({ signal }) => fetchPatients(filters, signal),
    placeholderData: keepPreviousData,
  });
