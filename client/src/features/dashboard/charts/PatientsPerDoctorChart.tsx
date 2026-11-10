"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DashboardStats } from "../dashboard.types";
import { AXIS_TICK, CHART_COLORS } from "./chart-theme";
import { ChartTooltip } from "./ChartTooltip";

type Row = DashboardStats["patientsPerDoctor"][number];

const ROW_HEIGHT = 40;
const MAX_LABEL_LENGTH = 19;

const truncate = (label: string): string =>
  label.length > MAX_LABEL_LENGTH ? `${label.slice(0, MAX_LABEL_LENGTH - 1)}…` : label;

export default function PatientsPerDoctorChart({ data }: { data: Row[] }) {
  const summary = data.map((row) => `${row.name}: ${row.count}`).join(", ");

  return (
    <div
      role="img"
      aria-label={`Horizontal bar chart of patients per doctor. ${summary}`}
      style={{ height: Math.max(data.length * ROW_HEIGHT + 56, 200) }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, bottom: 24, left: 0 }}>
          <CartesianGrid horizontal={false} stroke={CHART_COLORS.grid} />
          <XAxis
            type="number"
            allowDecimals={false}
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            label={{ value: "Patients", position: "insideBottom", offset: -12, fill: CHART_COLORS.text, fontSize: 12 }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={136}
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            tickFormatter={truncate}
          />
          <Tooltip
            cursor={{ fill: CHART_COLORS.cursor }}
            content={({ active, payload }) => {
              const row = active ? (payload?.[0]?.payload as Row | undefined) : undefined;
              if (!row) return null;
              return (
                <ChartTooltip
                  title={row.name}
                  subtitle={row.specialization}
                  rows={[{ color: CHART_COLORS.primary, label: "Patients", value: row.count }]}
                />
              );
            }}
          />
          <Bar dataKey="count" fill={CHART_COLORS.primary} radius={[0, 6, 6, 0]} barSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
