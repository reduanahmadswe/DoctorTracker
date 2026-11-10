import { api } from "@/lib/api-client";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import type { Paginated } from "@/types/api";
import type { CreateDoctorValues, CreatePatientValues } from "./doctors.schemas";
import type {
  Doctor,
  DoctorFilterOptions,
  DoctorListFilters,
  DoctorListItem,
  DoctorPatient,
} from "./doctors.types";

export const doctorKeys = {
  all: ["doctors"] as const,
  lists: ["doctors", "list"] as const,
  list: (filters: DoctorListFilters) => ["doctors", "list", filters] as const,
  filterOptions: ["doctors", "filters"] as const,
  detail: (id: string) => ["doctors", "detail", id] as const,
  patients: (id: string, page: number) => ["doctors", "detail", id, "patients", page] as const,
  patientsOf: (id: string) => ["doctors", "detail", id, "patients"] as const,
};

const toPaginated = <T>(result: { data: T[]; meta?: Paginated<T>["meta"] }): Paginated<T> => {
  if (!result.meta) throw new Error("Paginated response is missing meta");
  return { items: result.data, meta: result.meta };
};

export const fetchDoctors = async (
  filters: DoctorListFilters,
  signal?: AbortSignal,
): Promise<Paginated<DoctorListItem>> =>
  toPaginated(
    await api.get<DoctorListItem[]>("/doctors", {
      params: { ...filters, limit: DEFAULT_PAGE_SIZE },
      signal,
    }),
  );

export const fetchDoctorFilterOptions = async (signal?: AbortSignal): Promise<DoctorFilterOptions> =>
  (await api.get<DoctorFilterOptions>("/doctors/filters", { signal })).data;

export const fetchDoctor = async (id: string, signal?: AbortSignal): Promise<Doctor> =>
  (await api.get<Doctor>(`/doctors/${id}`, { signal })).data;

export const createDoctor = async (values: CreateDoctorValues): Promise<Doctor> =>
  (await api.post<Doctor>("/doctors", values)).data;

export const fetchDoctorPatients = async (
  id: string,
  page: number,
  signal?: AbortSignal,
): Promise<Paginated<DoctorPatient>> =>
  toPaginated(
    await api.get<DoctorPatient[]>(`/doctors/${id}/patients`, {
      params: { page, limit: DEFAULT_PAGE_SIZE },
      signal,
    }),
  );

export const addDoctorPatient = async (
  doctorId: string,
  values: CreatePatientValues,
): Promise<DoctorPatient> =>
  (await api.post<DoctorPatient>(`/doctors/${doctorId}/patients`, values)).data;

export const removeDoctorPatient = async (doctorId: string, patientId: string): Promise<void> => {
  await api.delete(`/doctors/${doctorId}/patients/${patientId}`);
};
