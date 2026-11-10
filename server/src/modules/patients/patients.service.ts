import type { QueryFilter } from 'mongoose';
import type { PaginationMeta } from '../../utils/apiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import {
  buildListSort,
  buildSearchAndDateFilter,
  buildTextScoreProjection,
} from '../../utils/listQuery.js';
import { buildPaginationMeta } from '../../utils/pagination.js';
import { assertDoctorExists } from '../doctors/doctors.service.js';
import { type Patient, type PatientCondition, PatientModel } from './patient.model.js';
import type { ListPatientsQuery, UpdatePatientInput } from './patients.schemas.js';

const PATIENT_FIELDS = 'name phone condition doctor createdAt updatedAt';
const DOCTOR_SUMMARY_FIELDS = 'name specialization';

interface PatientRecord {
  _id: { toString(): string };
  name: string;
  phone: string;
  condition: PatientCondition;
  doctor: { _id: { toString(): string }; name: string; specialization: string } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PatientDto {
  id: string;
  name: string;
  phone: string;
  condition: PatientCondition;
  doctor: { id: string; name: string; specialization: string } | null;
  createdAt: Date;
  updatedAt: Date;
}

const toPatientDto = (patient: PatientRecord): PatientDto => ({
  id: patient._id.toString(),
  name: patient.name,
  phone: patient.phone,
  condition: patient.condition,
  doctor: patient.doctor && {
    id: patient.doctor._id.toString(),
    name: patient.doctor.name,
    specialization: patient.doctor.specialization,
  },
  createdAt: patient.createdAt,
  updatedAt: patient.updatedAt,
});

export const buildPatientListQuery = ({ q, condition, doctor, from, to }: ListPatientsQuery) => {
  const filter: QueryFilter<Patient> = {
    ...buildSearchAndDateFilter({ q, from, to }),
    ...(condition && { condition }),
    ...(doctor && { doctor }),
  };
  return { filter, projection: buildTextScoreProjection(q), sort: buildListSort(q) };
};

// populate() over $lookup: the page holds at most 50 patients, so populate resolves their doctors
// with one extra indexed `_id: { $in }` query, keeps the main query a plain indexed find (which
// can use $text and sort/skip/limit directly) and avoids a per-document join inside the pipeline.
export const listPatients = async (
  query: ListPatientsQuery,
): Promise<{ items: PatientDto[]; meta: PaginationMeta }> => {
  const { page, limit } = query;
  const { filter, projection, sort } = buildPatientListQuery(query);

  const [patients, total] = await Promise.all([
    PatientModel.find(filter, projection)
      .select(PATIENT_FIELDS)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate<Pick<PatientRecord, 'doctor'>>('doctor', DOCTOR_SUMMARY_FIELDS)
      .lean(),
    PatientModel.countDocuments(filter),
  ]);

  return { items: patients.map(toPatientDto), meta: buildPaginationMeta({ page, limit }, total) };
};

export const updatePatient = async (id: string, input: UpdatePatientInput): Promise<PatientDto> => {
  if (input.doctor) await assertDoctorExists(input.doctor);

  const patient = await PatientModel.findByIdAndUpdate(
    id,
    { $set: input },
    { new: true, runValidators: true },
  )
    .select(PATIENT_FIELDS)
    .populate<Pick<PatientRecord, 'doctor'>>('doctor', DOCTOR_SUMMARY_FIELDS)
    .lean();
  if (!patient) throw ApiError.notFound('Patient not found');

  return toPatientDto(patient);
};

export const deletePatient = async (id: string): Promise<void> => {
  const deleted = await PatientModel.findByIdAndDelete(id).select('_id').lean();
  if (!deleted) throw ApiError.notFound('Patient not found');
};
