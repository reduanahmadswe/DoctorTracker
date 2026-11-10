"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  doctorKeys,
  fetchDoctor,
  fetchDoctorFilterOptions,
  fetchDoctorPatients,
  fetchDoctors,
} from "./doctors.api";
import type { DoctorListFilters } from "./doctors.types";

const FILTER_OPTIONS_STALE_TIME_MS = 5 * 60 * 1000;

// placeholderData keeps the previous page on screen while the next one loads.
export const useDoctors = (filters: DoctorListFilters) =>
  useQuery({
    queryKey: doctorKeys.list(filters),
    queryFn: ({ signal }) => fetchDoctors(filters, signal),
    placeholderData: keepPreviousData,
  });

export const useDoctorFilterOptions = () =>
  useQuery({
    queryKey: doctorKeys.filterOptions,
    queryFn: ({ signal }) => fetchDoctorFilterOptions(signal),
    staleTime: FILTER_OPTIONS_STALE_TIME_MS,
  });

export const useDoctor = (id: string) =>
  useQuery({
    queryKey: doctorKeys.detail(id),
    queryFn: ({ signal }) => fetchDoctor(id, signal),
  });

export const useDoctorPatients = (id: string, page: number) =>
  useQuery({
    queryKey: doctorKeys.patients(id, page),
    queryFn: ({ signal }) => fetchDoctorPatients(id, page, signal),
    placeholderData: keepPreviousData,
  });
