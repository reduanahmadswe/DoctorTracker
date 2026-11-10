import { sendSuccess } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import type { DashboardStatsQuery } from './dashboard.schemas.js';
import * as dashboardService from './dashboard.service.js';

export const getStats = asyncHandler(async (_req, res) => {
  sendSuccess(
    res,
    await dashboardService.getDashboardStats(res.locals.query as DashboardStatsQuery),
  );
});
