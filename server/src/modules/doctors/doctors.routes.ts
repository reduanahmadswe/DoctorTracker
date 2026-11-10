import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';
import { validate } from '../../middlewares/validate.js';
import * as doctorsController from './doctors.controller.js';
import {
  createDoctorPatientSchema,
  createDoctorSchema,
  doctorIdParamsSchema,
  doctorPatientParamsSchema,
  listDoctorPatientsQuerySchema,
  listDoctorsQuerySchema,
} from './doctors.schemas.js';

export const doctorsRouter = Router();

doctorsRouter.use(authenticate, authorize('admin'));

doctorsRouter.post('/', validate('body', createDoctorSchema), doctorsController.createDoctor);
doctorsRouter.get('/', validate('query', listDoctorsQuerySchema), doctorsController.listDoctors);
doctorsRouter.get('/filters', doctorsController.getFilterOptions);
doctorsRouter.get('/:id', validate('params', doctorIdParamsSchema), doctorsController.getDoctor);

doctorsRouter.get(
  '/:id/patients',
  validate('params', doctorIdParamsSchema),
  validate('query', listDoctorPatientsQuerySchema),
  doctorsController.listDoctorPatients,
);
doctorsRouter.post(
  '/:id/patients',
  validate('params', doctorIdParamsSchema),
  validate('body', createDoctorPatientSchema),
  doctorsController.addDoctorPatient,
);
doctorsRouter.delete(
  '/:id/patients/:patientId',
  validate('params', doctorPatientParamsSchema),
  doctorsController.removeDoctorPatient,
);
