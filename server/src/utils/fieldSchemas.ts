import { z } from 'zod';

export const requiredText = (max: number) => z.string().trim().min(1, 'Required').max(max);

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^[+()\d\s-]{7,20}$/, 'Enter a valid phone number');
