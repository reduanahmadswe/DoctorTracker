"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { DashboardStats } from "../dashboard.types";
import { CONDITION_COLORS } from "./chart-theme";
import { ChartTooltip } from "./ChartTooltip";

type Slice = DashboardStats["patientsByCondition"][number];

const CHART_HEIGHT = 220;

export default function ConditionChart({ data }: { data: Slice[] }) {
  const total = data.reduce((sum, slice) => sum + slice.count, 0);
  const summary = data.map((slice) => `${slice.condition}: ${slice.count}`).join(", ");

  return (
    <div className="flex flex-col gap-4">
      <div
        role="img"
        aria-label={`Donut chart of patients by condition. ${summary}`}
        className="relative"
        style={{ height: CHART_HEIGHT }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="condition"
              innerRadius="62%"
              outerRadius="90%"
              paddingAngle={2}
              stroke="var(--surface)"
              strokeWidth={2}
            >
              {data.map((slice) => (
                <Cell key={slice.condition} fill={CONDITION_COLORS[slice.condition]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                const slice = active ? (payload?.[0]?.payload as Slice | undefined) : undefined;
                if (!slice) return null;
                return (
                  <ChartTooltip
                    title={slice.condition}
                    rows={[
                      {
                        color: CONDITION_COLORS[slice.condition],
                        label: "Patients",
                        value: slice.count,
                      },
                    ]}
                  />
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-text tabular-nums">{total}</span>
          <span className="text-xs text-text-muted">patients</span>
        </div>
      </div>
      <ul className="grid grid-cols-1 gap-x-4 gap-y-2 min-[400px]:grid-cols-2">
        {data.map((slice) => (
          <li key={slice.condition} className="flex items-center gap-2 text-sm">
            <span
              aria-hidden
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: CONDITION_COLORS[slice.condition] }}
            />
            <span className="truncate text-text-muted">{slice.condition}</span>
            <span className="ml-auto font-medium text-text tabular-nums">{slice.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
