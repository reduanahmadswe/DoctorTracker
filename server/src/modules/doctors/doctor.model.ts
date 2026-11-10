import { type InferSchemaType, model, Schema } from 'mongoose';

const doctorSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    specialization: { type: String, required: true, trim: true, maxlength: 100 },
    hospital: { type: String, required: true, trim: true, maxlength: 150 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
  },
  { timestamps: true },
);

doctorSchema.index({ email: 1 }, { unique: true });
doctorSchema.index(
  { name: 'text', specialization: 'text', hospital: 'text', email: 'text' },
  { weights: { name: 10, specialization: 5, hospital: 3, email: 1 }, name: 'doctor_text_search' },
);
doctorSchema.index({ createdAt: -1 });
doctorSchema.index({ specialization: 1, createdAt: -1 });
doctorSchema.index({ hospital: 1, createdAt: -1 });

export type Doctor = InferSchemaType<typeof doctorSchema>;
export const DoctorModel = model('Doctor', doctorSchema);
