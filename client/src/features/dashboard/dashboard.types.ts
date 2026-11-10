import type { PatientCondition } from "@/lib/constants";

export interface DashboardStats {
  range: { from: string; to: string };
  totals: { doctors: number; patients: number };
  patientsPerDoctor: { doctorId: string; name: string; specialization: string; count: number }[];
  patientsByCondition: { condition: PatientCondition; count: number }[];
  dateStats: { date: string; patients: number; doctors: number }[];
}

export interface DashboardRange {
  from: string;
  to: string;
}
