import { z } from 'zod';
import { dateRangeShape, isValidDateRange } from '../../utils/dateRange.js';
import { countDaysInRange, MAX_RANGE_DAYS, resolveDayRange } from './dashboard.range.js';

export const dashboardStatsQuerySchema = z
  .object(dateRangeShape)
  .refine(isValidDateRange, { message: 'Invalid date range', path: ['from'], abort: true })
  .refine((query) => countDaysInRange(resolveDayRange(query)) <= MAX_RANGE_DAYS, {
    message: `Date range cannot exceed ${MAX_RANGE_DAYS} days`,
    path: ['to'],
  });

export type DashboardStatsQuery = z.infer<typeof dashboardStatsQuerySchema>;
