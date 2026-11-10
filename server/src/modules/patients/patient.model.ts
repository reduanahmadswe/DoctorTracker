import { type InferSchemaType, model, Schema } from 'mongoose';

export const PATIENT_CONDITIONS = ['Stable', 'Under Observation', 'Critical', 'Recovered'] as const;
export type PatientCondition = (typeof PATIENT_CONDITIONS)[number];

const patientSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    condition: { type: String, enum: PATIENT_CONDITIONS, required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  },
  { timestamps: true },
);

patientSchema.index({ name: 'text', phone: 'text' }, { name: 'patient_text_search' });
patientSchema.index({ doctor: 1, createdAt: -1 });
patientSchema.index({ condition: 1, createdAt: -1 });
patientSchema.index({ createdAt: -1 });

export type Patient = InferSchemaType<typeof patientSchema>;
export const PatientModel = model('Patient', patientSchema);
