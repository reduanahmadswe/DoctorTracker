import { api } from "@/lib/api-client";
import type { DashboardRange, DashboardStats } from "./dashboard.types";

// Mutations elsewhere invalidate ["dashboard"], which matches every range.
export const dashboardKeys = {
  stats: (range: DashboardRange) => ["dashboard", "stats", range] as const,
};

export const fetchDashboardStats = async (
  range: DashboardRange,
  signal?: AbortSignal,
): Promise<DashboardStats> =>
  (await api.get<DashboardStats>("/dashboard/stats", { params: { ...range }, signal })).data;
