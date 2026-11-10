import { type InferSchemaType, model, Schema } from 'mongoose';
import { buildSearchKeywords } from '../../utils/searchKeywords.js';

export const PATIENT_CONDITIONS = ['Stable', 'Under Observation', 'Critical', 'Recovered'] as const;
export type PatientCondition = (typeof PATIENT_CONDITIONS)[number];

const patientSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    condition: { type: String, enum: PATIENT_CONDITIONS, required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    // Word prefixes used by the search box; derived from name and phone, never sent to clients.
    searchKeywords: { type: [String], select: false },
  },
  { timestamps: true },
);

// Runs for create, save and insertMany, so the keywords always follow the searchable fields.
patientSchema.pre('validate', function () {
  this.searchKeywords = buildSearchKeywords(this.name, this.phone);
});

patientSchema.index({ searchKeywords: 1, createdAt: -1 });
patientSchema.index({ doctor: 1, createdAt: -1 });
patientSchema.index({ condition: 1, createdAt: -1 });
patientSchema.index({ createdAt: -1 });

export type Patient = InferSchemaType<typeof patientSchema>;
export const PatientModel = model('Patient', patientSchema);
