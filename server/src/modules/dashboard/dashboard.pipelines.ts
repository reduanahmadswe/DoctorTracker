import type { PipelineStage } from 'mongoose';

// Rows shown in the "patients per doctor" chart; keeps the chart readable.
const TOP_DOCTORS_LIMIT = 10;

// Per-day grouping always uses UTC so day buckets match the UTC day bounds of the range filter.
const DAY_FORMAT = '%Y-%m-%d';
const TIMEZONE = 'UTC';

// Uses the createdAt index for the $match, then groups into one bucket per day.
export const dailyCountsPipeline = (start: Date, end: Date): PipelineStage[] => [
  { $match: { createdAt: { $gte: start, $lte: end } } },
  {
    $group: {
      _id: { $dateToString: { format: DAY_FORMAT, date: '$createdAt', timezone: TIMEZONE } },
      count: { $sum: 1 },
    },
  },
];

// Without a $match the planner would scan the whole collection, so these pipelines are hinted to
// use the existing indexes: grouping on the indexed field is then answered from the index alone
// (covered, no document fetches). A $facet would force a collection scan, so each breakdown is
// its own pipeline and they run in parallel. The $lookup only runs on the (at most TOP_DOCTORS_LIMIT)
// grouped rows, never on every patient.
export const PATIENTS_BY_DOCTOR_INDEX = { doctor: 1, createdAt: -1 } as const;
export const PATIENTS_BY_CONDITION_INDEX = { condition: 1, createdAt: -1 } as const;

export const patientsPerDoctorPipeline = (): PipelineStage[] => [
  { $group: { _id: '$doctor', count: { $sum: 1 } } },
  { $sort: { count: -1, _id: 1 } },
  { $limit: TOP_DOCTORS_LIMIT },
  {
    $lookup: {
      from: 'doctors',
      localField: '_id',
      foreignField: '_id',
      pipeline: [{ $project: { _id: 0, name: 1, specialization: 1 } }],
      as: 'doctor',
    },
  },
  { $unwind: '$doctor' },
  {
    $project: {
      _id: 0,
      doctorId: '$_id',
      name: '$doctor.name',
      specialization: '$doctor.specialization',
      count: 1,
    },
  },
];

export const patientsByConditionPipeline = (): PipelineStage[] => [
  { $group: { _id: '$condition', count: { $sum: 1 } } },
];
