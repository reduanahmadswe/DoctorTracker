// All dashboard dates are UTC days, matching the UTC day bounds used by the list filters
// (utils/dateRange.ts) and the "UTC" timezone passed to $dateToString in the pipelines.
const DAY_MS = 24 * 60 * 60 * 1000;

export const DEFAULT_RANGE_DAYS = 30;
export const MAX_RANGE_DAYS = 366;

export interface DayRange {
  from: string;
  to: string;
}

const toDayString = (date: Date): string => date.toISOString().slice(0, 10);
const parseDay = (day: string): Date => new Date(`${day}T00:00:00.000Z`);

export const countDaysInRange = ({ from, to }: DayRange): number =>
  Math.round((parseDay(to).getTime() - parseDay(from).getTime()) / DAY_MS) + 1;

// Defaults to the last 30 days (today included) when a bound is missing.
export const resolveDayRange = ({ from, to }: { from?: string; to?: string }): DayRange => {
  const end = to ?? toDayString(new Date());
  const start =
    from ?? toDayString(new Date(parseDay(end).getTime() - (DEFAULT_RANGE_DAYS - 1) * DAY_MS));
  return { from: start, to: end };
};

export const listDays = (range: DayRange): string[] => {
  const start = parseDay(range.from).getTime();
  return Array.from({ length: countDaysInRange(range) }, (_, index) =>
    toDayString(new Date(start + index * DAY_MS)),
  );
};
