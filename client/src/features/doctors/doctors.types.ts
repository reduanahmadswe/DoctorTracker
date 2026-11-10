import type { PatientCondition } from "@/lib/constants";

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  createdAt: string;
}

export interface DoctorListItem extends Doctor {
  patientCount: number;
}

export interface DoctorFilterOptions {
  specializations: string[];
  hospitals: string[];
}

export interface DoctorPatient {
  id: string;
  name: string;
  phone: string;
  condition: PatientCondition;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorListFilters {
  q: string;
  specialization: string;
  hospital: string;
  from: string;
  to: string;
  page: number;
}
