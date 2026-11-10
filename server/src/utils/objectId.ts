import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

export const objectIdSchema = z
  .string()
  .refine((value) => /^[a-f\d]{24}$/i.test(value) && isValidObjectId(value), 'Invalid id');
