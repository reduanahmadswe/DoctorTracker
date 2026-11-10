import type { PatientCondition } from "@/lib/constants";
import { Badge, type BadgeVariant } from "./Badge";

// Stable = success, Under Observation = info, Critical = danger, Recovered = primary.
const conditionVariants: Record<PatientCondition, BadgeVariant> = {
  Stable: "success",
  "Under Observation": "info",
  Critical: "danger",
  Recovered: "primary",
};

export const ConditionBadge = ({ condition }: { condition: PatientCondition }) => (
  <Badge variant={conditionVariants[condition]}>{condition}</Badge>
);
