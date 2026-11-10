import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDatabase = async (): Promise<void> => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.MONGODB_URI);
};

export const disconnectDatabase = (): Promise<void> => mongoose.disconnect();
