import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDatabase = async (): Promise<void> => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.MONGODB_URI);
  // Build every index (including unique ones and the hinted dashboard indexes) before serving.
  await Promise.all(Object.values(mongoose.models).map((model) => model.init()));
};

export const disconnectDatabase = (): Promise<void> => mongoose.disconnect();
