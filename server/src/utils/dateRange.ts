import { z } from 'zod';

// Date parsing rolls "2026-02-31" over to March, so compare the round trip to reject it.
const isRealDay = (day: string): boolean => {
  const parsed = new Date(`${day}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(day);
};

const dayString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, { error: 'Use the YYYY-MM-DD format', abort: true })
  .refine(isRealDay, 'Enter a valid calendar date');

export const dateRangeShape = {
  from: dayString.optional(),
  to: dayString.optional(),
};

const startOfDay = (day: string): Date => new Date(`${day}T00:00:00.000Z`);
const endOfDay = (day: string): Date => new Date(`${day}T23:59:59.999Z`);

export const isValidDateRange = ({ from, to }: { from?: string; to?: string }): boolean => {
  if (from && Number.isNaN(startOfDay(from).getTime())) return false;
  if (to && Number.isNaN(endOfDay(to).getTime())) return false;
  return !(from && to) || startOfDay(from) <= endOfDay(to);
};

// Inclusive day bounds (UTC) for a createdAt filter.
export const buildCreatedAtFilter = ({ from, to }: { from?: string; to?: string }) => {
  if (!from && !to) return undefined;
  return {
    ...(from && { $gte: startOfDay(from) }),
    ...(to && { $lte: endOfDay(to) }),
  };
};
