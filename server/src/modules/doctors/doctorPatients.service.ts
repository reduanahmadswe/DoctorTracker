import type { PaginationMeta } from '../../utils/apiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { buildPaginationMeta, type Pagination } from '../../utils/pagination.js';
import { PatientModel, type PatientCondition } from '../patients/patient.model.js';
import type { CreateDoctorPatientInput } from './doctors.schemas.js';
import { assertDoctorExists } from './doctors.service.js';

const PATIENT_FIELDS = 'name phone condition createdAt updatedAt';

interface PatientRecord {
  _id: { toString(): string };
  name: string;
  phone: string;
  condition: PatientCondition;
  createdAt: Date;
  updatedAt: Date;
}

export interface DoctorPatientDto {
  id: string;
  name: string;
  phone: string;
  condition: PatientCondition;
  createdAt: Date;
  updatedAt: Date;
}

const toDoctorPatientDto = (patient: PatientRecord): DoctorPatientDto => ({
  id: patient._id.toString(),
  name: patient.name,
  phone: patient.phone,
  condition: patient.condition,
  createdAt: patient.createdAt,
  updatedAt: patient.updatedAt,
});

export const listDoctorPatients = async (
  doctorId: string,
  { page, limit, skip }: Pagination,
): Promise<{ items: DoctorPatientDto[]; meta: PaginationMeta }> => {
  await assertDoctorExists(doctorId);
  const filter = { doctor: doctorId };

  const [patients, total] = await Promise.all([
    PatientModel.find(filter)
      .select(PATIENT_FIELDS)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    PatientModel.countDocuments(filter),
  ]);

  return {
    items: patients.map(toDoctorPatientDto),
    meta: buildPaginationMeta({ page, limit }, total),
  };
};

export const addDoctorPatient = async (
  doctorId: string,
  input: CreateDoctorPatientInput,
): Promise<DoctorPatientDto> => {
  await assertDoctorExists(doctorId);
  const patient = await PatientModel.create({ ...input, doctor: doctorId });
  return toDoctorPatientDto(patient);
};

export const removeDoctorPatient = async (doctorId: string, patientId: string): Promise<void> => {
  const deleted = await PatientModel.findOneAndDelete({ _id: patientId, doctor: doctorId })
    .select('_id')
    .lean();
  if (!deleted) throw ApiError.notFound('Patient not found for this doctor');
};
