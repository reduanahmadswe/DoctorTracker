import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';
import { validate } from '../../middlewares/validate.js';
import * as patientsController from './patients.controller.js';
import {
  listPatientsQuerySchema,
  patientIdParamsSchema,
  updatePatientSchema,
} from './patients.schemas.js';

export const patientsRouter = Router();

patientsRouter.use(authenticate, authorize('admin'));

patientsRouter.get(
  '/',
  validate('query', listPatientsQuerySchema),
  patientsController.listPatients,
);
patientsRouter.patch(
  '/:id',
  validate('params', patientIdParamsSchema),
  validate('body', updatePatientSchema),
  patientsController.updatePatient,
);
patientsRouter.delete(
  '/:id',
  validate('params', patientIdParamsSchema),
  patientsController.deletePatient,
);
