import { sendSuccess } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import type { Pagination } from '../../utils/pagination.js';
import * as doctorPatientsService from './doctorPatients.service.js';
import type {
  CreateDoctorInput,
  CreateDoctorPatientInput,
  ListDoctorsQuery,
} from './doctors.schemas.js';
import * as doctorsService from './doctors.service.js';

export const createDoctor = asyncHandler(async (_req, res) => {
  const doctor = await doctorsService.createDoctor(res.locals.body as CreateDoctorInput);
  sendSuccess(res, doctor, { status: 201 });
});

export const listDoctors = asyncHandler(async (_req, res) => {
  const { items, meta } = await doctorsService.listDoctors(res.locals.query as ListDoctorsQuery);
  sendSuccess(res, items, { meta });
});

export const getFilterOptions = asyncHandler(async (_req, res) => {
  sendSuccess(res, await doctorsService.getDoctorFilterOptions());
});

export const getDoctor = asyncHandler(async (_req, res) => {
  const { id } = res.locals.params as { id: string };
  sendSuccess(res, await doctorsService.getDoctorById(id));
});

export const listDoctorPatients = asyncHandler(async (_req, res) => {
  const { id } = res.locals.params as { id: string };
  const { page, limit } = res.locals.query as Omit<Pagination, 'skip'>;
  const { items, meta } = await doctorPatientsService.listDoctorPatients(id, {
    page,
    limit,
    skip: (page - 1) * limit,
  });
  sendSuccess(res, items, { meta });
});

export const addDoctorPatient = asyncHandler(async (_req, res) => {
  const { id } = res.locals.params as { id: string };
  const patient = await doctorPatientsService.addDoctorPatient(
    id,
    res.locals.body as CreateDoctorPatientInput,
  );
  sendSuccess(res, patient, { status: 201 });
});

export const removeDoctorPatient = asyncHandler(async (_req, res) => {
  const { id, patientId } = res.locals.params as { id: string; patientId: string };
  await doctorPatientsService.removeDoctorPatient(id, patientId);
  sendSuccess(res, { deleted: true });
});
