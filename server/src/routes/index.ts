import { Router } from 'express';
import { authRouter } from '../modules/auth/auth.routes.js';
import { doctorsRouter } from '../modules/doctors/doctors.routes.js';
import { patientsRouter } from '../modules/patients/patients.routes.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  sendSuccess(res, { status: 'ok' });
});

apiRouter.use('/auth', authRouter);
apiRouter.use('/doctors', doctorsRouter);
apiRouter.use('/patients', patientsRouter);
