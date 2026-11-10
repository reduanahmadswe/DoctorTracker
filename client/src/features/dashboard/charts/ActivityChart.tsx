"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardStats } from "../dashboard.types";
import { AXIS_TICK, CHART_COLORS, formatDayLabel } from "./chart-theme";
import { ChartTooltip } from "./ChartTooltip";

type Day = DashboardStats["dateStats"][number];

const CHART_HEIGHT = 300;
const MIN_TICK_GAP_PX = 32;

export default function ActivityChart({ data }: { data: Day[] }) {
  const patients = data.reduce((sum, day) => sum + day.patients, 0);
  const doctors = data.reduce((sum, day) => sum + day.doctors, 0);

  return (
    <div
      role="img"
      aria-label={`Area chart of new patients and new doctors per day. ${patients} patients and ${doctors} doctors were added in this range.`}
      style={{ height: CHART_HEIGHT }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 0 }}>
          <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDayLabel}
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={{ stroke: CHART_COLORS.grid }}
            minTickGap={MIN_TICK_GAP_PX}
          />
          <YAxis
            allowDecimals={false}
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            width={40}
            label={{ value: "Added", angle: -90, position: "insideLeft", fill: CHART_COLORS.text, fontSize: 12 }}
          />
          <Tooltip
            content={({ active, payload }) => {
              const day = active ? (payload?.[0]?.payload as Day | undefined) : undefined;
              if (!day) return null;
              return (
                <ChartTooltip
                  title={formatDayLabel(day.date)}
                  rows={[
                    { color: CHART_COLORS.primary, label: "New patients", value: day.patients },
                    { color: CHART_COLORS.info, label: "New doctors", value: day.doctors },
                  ]}
                />
              );
            }}
          />
          <Legend verticalAlign="top" height={32} iconType="circle" />
          <Area
            type="monotone"
            dataKey="patients"
            name="New patients"
            stroke={CHART_COLORS.primary}
            fill={CHART_COLORS.primary}
            fillOpacity={0.14}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="doctors"
            name="New doctors"
            stroke={CHART_COLORS.info}
            fill={CHART_COLORS.info}
            fillOpacity={0.1}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
