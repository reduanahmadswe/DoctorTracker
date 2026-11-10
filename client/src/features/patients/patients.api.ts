import { api } from "@/lib/api-client";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import type { Paginated } from "@/types/api";
import type { EditPatientValues } from "./patients.schemas";
import type { Patient, PatientListFilters } from "./patients.types";

export const patientKeys = {
  all: ["patients"] as const,
  lists: ["patients", "list"] as const,
  list: (filters: PatientListFilters) => ["patients", "list", filters] as const,
};

export const fetchPatients = async (
  filters: PatientListFilters,
  signal?: AbortSignal,
): Promise<Paginated<Patient>> => {
  const { data, meta } = await api.get<Patient[]>("/patients", {
    params: { ...filters, limit: DEFAULT_PAGE_SIZE },
    signal,
  });
  if (!meta) throw new Error("Paginated response is missing meta");
  return { items: data, meta };
};

export const updatePatient = async (id: string, values: EditPatientValues): Promise<Patient> =>
  (await api.patch<Patient>(`/patients/${id}`, values)).data;

export const deletePatient = async (id: string): Promise<void> => {
  await api.delete(`/patients/${id}`);
};
