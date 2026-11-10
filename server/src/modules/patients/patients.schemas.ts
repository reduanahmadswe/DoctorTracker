import { z } from 'zod';
import { dateRangeShape, isValidDateRange } from '../../utils/dateRange.js';
import { objectIdSchema } from '../../utils/objectId.js';
import { paginationQuerySchema } from '../../utils/pagination.js';
import { PATIENT_CONDITIONS } from './patient.model.js';

const phoneSchema = z
  .string()
  .trim()
  .regex(/^[+()\d\s-]{7,20}$/, 'Enter a valid phone number');

export const listPatientsQuerySchema = paginationQuerySchema
  .extend({
    q: z.string().trim().min(1).max(100).optional(),
    condition: z.enum(PATIENT_CONDITIONS).optional(),
    doctor: objectIdSchema.optional(),
    ...dateRangeShape,
  })
  .refine(isValidDateRange, { message: 'Invalid date range', path: ['from'] });

export const patientIdParamsSchema = z.object({ id: objectIdSchema });

export const updatePatientSchema = z
  .object({
    name: z.string().trim().min(1, 'Required').max(100),
    phone: phoneSchema,
    condition: z.enum(PATIENT_CONDITIONS),
    doctor: objectIdSchema,
  })
  .partial()
  .refine((input) => Object.keys(input).length > 0, {
    message: 'Provide at least one field to update',
  });

export type ListPatientsQuery = z.infer<typeof listPatientsQuerySchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
