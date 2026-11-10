import type { Types } from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/db.js';
import { env } from '../config/env.js';
import { DoctorModel } from '../modules/doctors/doctor.model.js';
import { PatientModel } from '../modules/patients/patient.model.js';
import { buildSearchKeywords } from '../utils/searchKeywords.js';

interface Searchable {
  _id: Types.ObjectId;
  name: string;
  email?: string;
  specialization?: string;
  hospital?: string;
  phone?: string;
}

type KeywordUpdate = {
  updateOne: {
    filter: { _id: Types.ObjectId };
    update: { $set: { searchKeywords: string[] } };
  };
};

const BATCH_SIZE = 500;
const SEARCH_FIELDS = 'name email specialization hospital phone';

const toKeywordUpdate = (doc: Searchable): KeywordUpdate => ({
  updateOne: {
    filter: { _id: doc._id },
    update: {
      $set: {
        searchKeywords: buildSearchKeywords(
          doc.name,
          doc.specialization,
          doc.hospital,
          doc.email,
          doc.phone,
        ),
      },
    },
  },
});

// Rebuilds the search keywords of one collection in batches. Safe to run repeatedly.
const backfill = async (
  label: string,
  documents: AsyncIterable<Searchable>,
  write: (updates: KeywordUpdate[]) => Promise<unknown>,
): Promise<void> => {
  let batch: KeywordUpdate[] = [];
  let total = 0;

  for await (const doc of documents) {
    batch.push(toKeywordUpdate(doc));
    total += 1;
    if (batch.length >= BATCH_SIZE) {
      await write(batch);
      batch = [];
    }
  }
  if (batch.length > 0) await write(batch);
  process.stdout.write(`${label}: updated ${total} documents.\n`);
};

const describeHost = (uri: string): string =>
  uri.replace(/^[a-z+]+:\/\/[^@]*@/i, '').split(/[/?]/)[0] ?? '';

const run = async (): Promise<void> => {
  process.stdout.write(`Database host: ${describeHost(env.MONGODB_URI)}\n`);
  await connectDatabase();

  await backfill(
    'Doctors',
    DoctorModel.find().select(SEARCH_FIELDS).lean<Searchable[]>().cursor(),
    (updates) => DoctorModel.bulkWrite(updates),
  );
  await backfill(
    'Patients',
    PatientModel.find().select(SEARCH_FIELDS).lean<Searchable[]>().cursor(),
    (updates) => PatientModel.bulkWrite(updates),
  );

  // Drops indexes that are no longer in the schema (the old text indexes) and builds the new ones.
  await Promise.all([DoctorModel.syncIndexes(), PatientModel.syncIndexes()]);
  process.stdout.write('Indexes synchronized.\n');
};

run()
  .catch((error: unknown) => {
    process.stderr.write(`Backfill failed: ${String(error)}\n`);
    process.exitCode = 1;
  })
  .finally(() => disconnectDatabase());
