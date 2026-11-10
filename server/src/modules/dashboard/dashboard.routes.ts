import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';
import { validate } from '../../middlewares/validate.js';
import * as dashboardController from './dashboard.controller.js';
import { dashboardStatsQuerySchema } from './dashboard.schemas.js';

export const dashboardRouter = Router();

dashboardRouter.use(authenticate, authorize('admin'));

dashboardRouter.get(
  '/stats',
  validate('query', dashboardStatsQuerySchema),
  dashboardController.getStats,
);
