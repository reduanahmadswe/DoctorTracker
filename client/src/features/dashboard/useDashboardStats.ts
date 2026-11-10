"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { dashboardKeys, fetchDashboardStats } from "./dashboard.api";
import type { DashboardRange } from "./dashboard.types";

// An empty bound means "use the server default" (last 30 days); the response reports the
// resolved range. The previous range stays visible while a new one loads.
export const useDashboardStats = (range: DashboardRange) =>
  useQuery({
    queryKey: dashboardKeys.stats(range),
    queryFn: ({ signal }) => fetchDashboardStats(range, signal),
    placeholderData: keepPreviousData,
  });
