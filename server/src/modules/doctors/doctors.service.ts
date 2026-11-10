import type { QueryFilter } from 'mongoose';
import type { PaginationMeta } from '../../utils/apiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import {
  buildListSort,
  buildSearchAndDateFilter,
  buildTextScoreProjection,
} from '../../utils/listQuery.js';
import { buildPaginationMeta } from '../../utils/pagination.js';
import { PatientModel } from '../patients/patient.model.js';
import { type Doctor, DoctorModel } from './doctor.model.js';
import type { CreateDoctorInput, ListDoctorsQuery } from './doctors.schemas.js';

const DOCTOR_FIELDS = 'name specialization hospital phone email createdAt';

interface DoctorRecord {
  _id: { toString(): string };
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  createdAt: Date;
}

export interface DoctorDto {
  id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  createdAt: Date;
}

export interface DoctorListItemDto extends DoctorDto {
  patientCount: number;
}

const toDoctorDto = (doctor: DoctorRecord): DoctorDto => ({
  id: doctor._id.toString(),
  name: doctor.name,
  specialization: doctor.specialization,
  hospital: doctor.hospital,
  phone: doctor.phone,
  email: doctor.email,
  createdAt: doctor.createdAt,
});

export const buildDoctorListQuery = ({
  q,
  specialization,
  hospital,
  from,
  to,
}: ListDoctorsQuery) => {
  const filter: QueryFilter<Doctor> = {
    ...buildSearchAndDateFilter({ q, from, to }),
    ...(specialization && { specialization }),
    ...(hospital && { hospital }),
  };
  return { filter, projection: buildTextScoreProjection(q), sort: buildListSort(q) };
};

const countPatientsByDoctor = async (doctorIds: unknown[]): Promise<Map<string, number>> => {
  if (doctorIds.length === 0) return new Map();
  const counts = await PatientModel.aggregate<{ _id: { toString(): string }; count: number }>([
    { $match: { doctor: { $in: doctorIds } } },
    { $group: { _id: '$doctor', count: { $sum: 1 } } },
  ]);
  return new Map(counts.map(({ _id, count }) => [_id.toString(), count]));
};

export const createDoctor = async (input: CreateDoctorInput): Promise<DoctorDto> => {
  const doctor = await DoctorModel.create(input);
  return toDoctorDto(doctor);
};

export const listDoctors = async (
  query: ListDoctorsQuery,
): Promise<{ items: DoctorListItemDto[]; meta: PaginationMeta }> => {
  const { page, limit } = query;
  const { filter, projection, sort } = buildDoctorListQuery(query);

  const [doctors, total] = await Promise.all([
    DoctorModel.find(filter, projection)
      .select(DOCTOR_FIELDS)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    DoctorModel.countDocuments(filter),
  ]);

  const patientCounts = await countPatientsByDoctor(doctors.map((doctor) => doctor._id));
  const items = doctors.map((doctor) => ({
    ...toDoctorDto(doctor),
    patientCount: patientCounts.get(doctor._id.toString()) ?? 0,
  }));

  return { items, meta: buildPaginationMeta({ page, limit }, total) };
};

export const getDoctorFilterOptions = async (): Promise<{
  specializations: string[];
  hospitals: string[];
}> => {
  const [specializations, hospitals] = await Promise.all([
    DoctorModel.distinct('specialization'),
    DoctorModel.distinct('hospital'),
  ]);
  const alphabetical = (a: string, b: string) => a.localeCompare(b);
  return {
    specializations: specializations.sort(alphabetical),
    hospitals: hospitals.sort(alphabetical),
  };
};

export const getDoctorById = async (id: string): Promise<DoctorDto> => {
  const doctor = await DoctorModel.findById(id).select(DOCTOR_FIELDS).lean();
  if (!doctor) throw ApiError.notFound('Doctor not found');
  return toDoctorDto(doctor);
};

export const assertDoctorExists = async (id: string): Promise<void> => {
  const exists = await DoctorModel.exists({ _id: id });
  if (!exists) throw ApiError.notFound('Doctor not found');
};
