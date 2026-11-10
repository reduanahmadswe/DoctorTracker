import { z } from 'zod';
import { dateRangeShape, isValidDateRange } from '../../utils/dateRange.js';
import { objectIdSchema } from '../../utils/objectId.js';
import { paginationQuerySchema } from '../../utils/pagination.js';
import { PATIENT_CONDITIONS } from '../patients/patient.model.js';

const phoneSchema = z
  .string()
  .trim()
  .regex(/^[+()\d\s-]{7,20}$/, 'Enter a valid phone number');
const requiredText = (max: number) => z.string().trim().min(1, 'Required').max(max);

export const createDoctorSchema = z.object({
  name: requiredText(100),
  specialization: requiredText(100),
  hospital: requiredText(150),
  phone: phoneSchema,
  email: z.email().trim().toLowerCase().max(254),
});

export const listDoctorsQuerySchema = paginationQuerySchema
  .extend({
    q: z.string().trim().min(1).max(100).optional(),
    specialization: z.string().trim().min(1).max(100).optional(),
    hospital: z.string().trim().min(1).max(150).optional(),
    ...dateRangeShape,
  })
  .refine(isValidDateRange, { message: 'Invalid date range', path: ['from'] });

export const doctorIdParamsSchema = z.object({ id: objectIdSchema });

export const doctorPatientParamsSchema = z.object({
  id: objectIdSchema,
  patientId: objectIdSchema,
});

export const listDoctorPatientsQuerySchema = paginationQuerySchema;

export const createDoctorPatientSchema = z.object({
  name: requiredText(100),
  phone: phoneSchema,
  condition: z.enum(PATIENT_CONDITIONS),
});

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;
export type ListDoctorsQuery = z.infer<typeof listDoctorsQuerySchema>;
export type CreateDoctorPatientInput = z.infer<typeof createDoctorPatientSchema>;
