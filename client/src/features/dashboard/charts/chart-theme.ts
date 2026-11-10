import type { PatientCondition } from "@/lib/constants";

// Recharts takes colors as strings, so the theme tokens are referenced as CSS variables.
export const CHART_COLORS = {
  primary: "var(--primary)",
  info: "var(--info)",
  grid: "var(--border)",
  text: "var(--text-muted)",
  cursor: "var(--primary-soft)",
} as const;

// Same mapping as the condition badges: Stable = success, Under Observation = info,
// Critical = danger, Recovered = primary.
export const CONDITION_COLORS: Record<PatientCondition, string> = {
  Stable: "var(--success)",
  "Under Observation": "var(--info)",
  Critical: "var(--danger)",
  Recovered: "var(--primary)",
};

export const AXIS_TICK = { fill: CHART_COLORS.text, fontSize: 12 } as const;

export const formatDayLabel = (isoDay: string): string =>
  new Date(`${isoDay}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
