import { z } from "zod";
import { createPatientSchema } from "@/features/doctors/doctors.schemas";

// Same fields as adding a patient under a doctor, plus the doctor the patient belongs to.
export const editPatientSchema = createPatientSchema.extend({
  doctor: z.string().min(1, "Select a doctor"),
});

export type EditPatientValues = z.infer<typeof editPatientSchema>;
