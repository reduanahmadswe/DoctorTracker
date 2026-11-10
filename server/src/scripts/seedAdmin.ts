import { connectDatabase, disconnectDatabase } from '../config/db.js';
import { env } from '../config/env.js';
import { hashPassword } from '../modules/auth/password.js';
import { UserModel } from '../modules/auth/user.model.js';

const ADMIN_NAME = 'Administrator';

const seedAdmin = async (): Promise<void> => {
  const { SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD } = env;
  if (!SEED_ADMIN_EMAIL || !SEED_ADMIN_PASSWORD) {
    throw new Error('Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD (min 8 characters) first.');
  }

  await connectDatabase();
  const email = SEED_ADMIN_EMAIL.toLowerCase();

  const exists = await UserModel.exists({ email });
  if (exists) {
    process.stdout.write(`Admin ${email} already exists, nothing to do.\n`);
    return;
  }

  await UserModel.create({
    name: ADMIN_NAME,
    email,
    password: await hashPassword(SEED_ADMIN_PASSWORD),
    role: 'admin',
  });
  process.stdout.write(`Admin ${email} created.\n`);
};

seedAdmin()
  .catch((error: unknown) => {
    process.stderr.write(`Seeding failed: ${String(error)}\n`);
    process.exitCode = 1;
  })
  .finally(() => disconnectDatabase());
