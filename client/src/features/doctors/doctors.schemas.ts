import { z } from "zod";
import { PATIENT_CONDITIONS } from "@/lib/constants";

const requiredText = (label: string, max: number) =>
  z.string().trim().min(1, `Enter the ${label}`).max(max, `Keep the ${label} under ${max} characters`);

const phoneSchema = z
  .string()
  .trim()
  .min(1, "Enter a phone number")
  .regex(/^[+()\d\s-]{7,20}$/, "Enter a valid phone number");

export const createDoctorSchema = z.object({
  name: requiredText("name", 100),
  specialization: requiredText("specialization", 100),
  hospital: requiredText("hospital", 150),
  phone: phoneSchema,
  email: z.string().trim().min(1, "Enter an email address").pipe(z.email("Enter a valid email address")),
});

export const createPatientSchema = z.object({
  name: requiredText("name", 100),
  phone: phoneSchema,
  condition: z.enum(PATIENT_CONDITIONS, { error: "Select a condition" }),
});

export type CreateDoctorValues = z.infer<typeof createDoctorSchema>;
export type CreatePatientValues = z.infer<typeof createPatientSchema>;
