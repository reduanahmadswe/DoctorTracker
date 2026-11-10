import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDatabase = async (): Promise<void> => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.MONGODB_URI);
  // Build every index (including unique ones and the hinted dashboard indexes) before serving.
  await Promise.all(Object.values(mongoose.models).map((model) => model.init()));
};

// Opens the connection once and shares it. A warm serverless instance reuses it for later requests;
// a failed attempt is forgotten so the next request tries again.
let connection: Promise<void> | undefined;

export const ensureDatabase = (): Promise<void> => {
  connection ??= connectDatabase().catch((error: unknown) => {
    connection = undefined;
    throw error;
  });
  return connection;
};

export const disconnectDatabase = (): Promise<void> => mongoose.disconnect();
