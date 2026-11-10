import { connectDatabase, disconnectDatabase } from '../config/db.js';
import { isProduction } from '../config/env.js';
import { DoctorModel } from '../modules/doctors/doctor.model.js';
import { PATIENT_CONDITIONS, PatientModel } from '../modules/patients/patient.model.js';

const DAY_MS = 24 * 60 * 60 * 1000;
const HISTORY_DAYS = 150;

const SPECIALIZATIONS = [
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Dermatology',
  'Oncology',
];
const HOSPITALS = [
  'City General Hospital',
  'Green Valley Medical Center',
  'Sunrise Clinic',
  'Riverside Hospital',
];
const DOCTOR_NAMES = [
  'Amelia Hart',
  'Rahim Chowdhury',
  'Nadia Rahman',
  'Daniel Okafor',
  'Sofia Martinez',
  'Arif Hossain',
  'Priya Nair',
  'Liam Becker',
  'Tahmina Akter',
  'Omar Haddad',
  'Chloe Bennett',
  'Kamal Uddin',
];
const FIRST_NAMES = [
  'Ayesha',
  'Imran',
  'Maria',
  'Noah',
  'Farhana',
  'Lucas',
  'Sara',
  'Jamal',
  'Emma',
];
const LAST_NAMES = ['Khan', 'Smith', 'Ali', 'Garcia', 'Rahman', 'Johnson', 'Islam', 'Brown'];

const pick = <T>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)] as T;
const randomPastDate = (maxDaysAgo: number): Date =>
  new Date(Date.now() - Math.random() * maxDaysAgo * DAY_MS);
const randomPhone = (): string => `+8801${Math.floor(100000000 + Math.random() * 900000000)}`;
const slug = (name: string): string => name.toLowerCase().replace(/\s+/g, '.');

const seedDemo = async (): Promise<void> => {
  if (isProduction) throw new Error('seed:demo must not run in production');
  await connectDatabase();

  if ((await DoctorModel.estimatedDocumentCount()) > 0) {
    process.stdout.write('Doctors already exist, skipping demo data.\n');
    return;
  }

  const doctors = await DoctorModel.insertMany(
    DOCTOR_NAMES.map((name, index) => {
      const createdAt = randomPastDate(HISTORY_DAYS);
      return {
        name: `Dr. ${name}`,
        specialization: SPECIALIZATIONS[index % SPECIALIZATIONS.length],
        hospital: pick(HOSPITALS),
        phone: randomPhone(),
        email: `${slug(name)}@doctortracker.demo`,
        createdAt,
        updatedAt: createdAt,
      };
    }),
  );

  const patients = doctors.flatMap((doctor) => {
    const count = 4 + Math.floor(Math.random() * 9);
    return Array.from({ length: count }, () => {
      const earliest = Math.ceil((Date.now() - doctor.createdAt.getTime()) / DAY_MS);
      const createdAt = randomPastDate(Math.max(earliest, 1));
      return {
        name: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
        phone: randomPhone(),
        condition: pick(PATIENT_CONDITIONS),
        doctor: doctor._id,
        createdAt,
        updatedAt: createdAt,
      };
    });
  });
  await PatientModel.insertMany(patients);

  process.stdout.write(`Inserted ${doctors.length} doctors and ${patients.length} patients.\n`);
};

seedDemo()
  .catch((error: unknown) => {
    process.stderr.write(`Demo seeding failed: ${String(error)}\n`);
    process.exitCode = 1;
  })
  .finally(() => disconnectDatabase());
