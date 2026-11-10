import type { PatientCondition } from "@/lib/constants";

export interface Patient {
  id: string;
  name: string;
  phone: string;
  condition: PatientCondition;
  doctor: { id: string; name: string; specialization: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface PatientListFilters {
  q: string;
  condition: string;
  doctor: string;
  from: string;
  to: string;
  page: number;
}
