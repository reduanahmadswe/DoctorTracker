import { DoctorModel } from '../doctors/doctor.model.js';
import {
  PATIENT_CONDITIONS,
  type PatientCondition,
  PatientModel,
} from '../patients/patient.model.js';
import { listDays, resolveDayRange } from './dashboard.range.js';
import {
  dailyCountsPipeline,
  PATIENTS_BY_CONDITION_INDEX,
  PATIENTS_BY_DOCTOR_INDEX,
  patientsByConditionPipeline,
  patientsPerDoctorPipeline,
} from './dashboard.pipelines.js';
import type { DashboardStatsQuery } from './dashboard.schemas.js';

interface DailyCount {
  _id: string;
  count: number;
}

interface DoctorPatientCount {
  doctorId: { toString(): string };
  name: string;
  specialization: string;
  count: number;
}

interface ConditionCount {
  _id: PatientCondition;
  count: number;
}

export interface DashboardStats {
  range: { from: string; to: string };
  totals: { doctors: number; patients: number };
  patientsPerDoctor: { doctorId: string; name: string; specialization: string; count: number }[];
  patientsByCondition: { condition: PatientCondition; count: number }[];
  dateStats: { date: string; patients: number; doctors: number }[];
}

const toCountMap = (rows: DailyCount[]): Map<string, number> =>
  new Map(rows.map(({ _id, count }) => [_id, count]));

// Totals and both breakdowns describe the whole dataset; only dateStats follows the requested
// range (UTC days, missing days filled with 0).
export const getDashboardStats = async (query: DashboardStatsQuery): Promise<DashboardStats> => {
  const range = resolveDayRange(query);
  const start = new Date(`${range.from}T00:00:00.000Z`);
  const end = new Date(`${range.to}T23:59:59.999Z`);

  const [doctorTotal, patientTotal, perDoctor, byCondition, patientDays, doctorDays] =
    await Promise.all([
      DoctorModel.estimatedDocumentCount(),
      PatientModel.estimatedDocumentCount(),
      PatientModel.aggregate<DoctorPatientCount>(patientsPerDoctorPipeline()).hint(
        PATIENTS_BY_DOCTOR_INDEX,
      ),
      PatientModel.aggregate<ConditionCount>(patientsByConditionPipeline()).hint(
        PATIENTS_BY_CONDITION_INDEX,
      ),
      PatientModel.aggregate<DailyCount>(dailyCountsPipeline(start, end)),
      DoctorModel.aggregate<DailyCount>(dailyCountsPipeline(start, end)),
    ]);

  const conditionCounts = new Map(byCondition.map(({ _id, count }) => [_id, count]));
  const patientsPerDay = toCountMap(patientDays);
  const doctorsPerDay = toCountMap(doctorDays);

  return {
    range,
    totals: { doctors: doctorTotal, patients: patientTotal },
    patientsPerDoctor: perDoctor.map((row) => ({ ...row, doctorId: row.doctorId.toString() })),
    patientsByCondition: PATIENT_CONDITIONS.map((condition) => ({
      condition,
      count: conditionCounts.get(condition) ?? 0,
    })),
    dateStats: listDays(range).map((date) => ({
      date,
      patients: patientsPerDay.get(date) ?? 0,
      doctors: doctorsPerDay.get(date) ?? 0,
    })),
  };
};
