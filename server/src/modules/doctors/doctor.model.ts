import { type InferSchemaType, model, Schema } from 'mongoose';
import { buildSearchKeywords } from '../../utils/searchKeywords.js';

const doctorSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    specialization: { type: String, required: true, trim: true, maxlength: 100 },
    hospital: { type: String, required: true, trim: true, maxlength: 150 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    // Word prefixes used by the search box; derived from the fields above, never sent to clients.
    searchKeywords: { type: [String], select: false },
  },
  { timestamps: true },
);

// Runs for create, save and insertMany, so the keywords always follow the searchable fields.
doctorSchema.pre('validate', function () {
  this.searchKeywords = buildSearchKeywords(
    this.name,
    this.specialization,
    this.hospital,
    this.email,
  );
});

doctorSchema.index({ email: 1 }, { unique: true });
doctorSchema.index({ searchKeywords: 1, createdAt: -1 });
doctorSchema.index({ createdAt: -1 });
doctorSchema.index({ specialization: 1, createdAt: -1 });
doctorSchema.index({ hospital: 1, createdAt: -1 });

export type Doctor = InferSchemaType<typeof doctorSchema>;
export const DoctorModel = model('Doctor', doctorSchema);
