export const PATIENT_CONDITIONS = [
  "Stable",
  "Under Observation",
  "Critical",
  "Recovered",
] as const;

export type PatientCondition = (typeof PATIENT_CONDITIONS)[number];

export const DEFAULT_PAGE_SIZE = 10;
export const SEARCH_DEBOUNCE_MS = 300;
export const LOGIN_PATH = "/login";
export const AUTH_COOKIE_NAME = "token";
