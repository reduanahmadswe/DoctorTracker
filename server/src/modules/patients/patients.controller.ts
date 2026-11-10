import { sendSuccess } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import type { ListPatientsQuery, UpdatePatientInput } from './patients.schemas.js';
import * as patientsService from './patients.service.js';

export const listPatients = asyncHandler(async (_req, res) => {
  const { items, meta } = await patientsService.listPatients(res.locals.query as ListPatientsQuery);
  sendSuccess(res, items, { meta });
});

export const updatePatient = asyncHandler(async (_req, res) => {
  const { id } = res.locals.params as { id: string };
  const patient = await patientsService.updatePatient(id, res.locals.body as UpdatePatientInput);
  sendSuccess(res, patient);
});

export const deletePatient = asyncHandler(async (_req, res) => {
  const { id } = res.locals.params as { id: string };
  await patientsService.deletePatient(id);
  sendSuccess(res, { deleted: true });
});
