"use client";

import { Activity, ChartPie, Users } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ChartCard, ChartCardSkeleton } from "@/components/ui/ChartCard";
import { DateRangeFilter } from "@/components/ui/DateRangeFilter";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { ApiError } from "@/lib/api-client";
import { useUrlParams } from "@/lib/use-url-params";
import { StatCards, StatCardsSkeleton } from "./StatCards";
import { useDashboardStats } from "./useDashboardStats";

// Recharts is only needed on this page, so it is loaded on demand and never rendered on the server.
const ChartSkeleton = ({ height }: { height: number }) => (
  <Skeleton className="w-full" style={{ height }} />
);
const PatientsPerDoctorChart = dynamic(() => import("./charts/PatientsPerDoctorChart"), {
  ssr: false,
  loading: () => <ChartSkeleton height={320} />,
});
const ActivityChart = dynamic(() => import("./charts/ActivityChart"), {
  ssr: false,
  loading: () => <ChartSkeleton height={300} />,
});
const ConditionChart = dynamic(() => import("./charts/ConditionChart"), {
  ssr: false,
  loading: () => <ChartSkeleton height={300} />,
});

const BAD_REQUEST_STATUS = 400;

export const DashboardView = () => {
  const { searchParams, update } = useUrlParams();
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  const hasCustomRange = Boolean(from || to);

  const { data, error, isPending, isError, isFetching, isPlaceholderData, refetch } =
    useDashboardStats({ from, to });

  const handleRangeChange = useCallback(
    (range: { from: string; to: string }) => update(range),
    [update],
  );
  const resetRange = useCallback(() => update({ from: "", to: "" }), [update]);

  const isRefreshing = isPlaceholderData;
  const noPatients = data?.totals.patients === 0;

  return (
    <>
      <PageHeader title="Dashboard" description="An overview of doctors and patients." />

      <Card>
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:p-6">
          <div className="grid flex-1 grid-cols-2 gap-4 sm:max-w-md">
            <DateRangeFilter
              idPrefix="dashboard"
              from={from || (data?.range.from ?? "")}
              to={to || (data?.range.to ?? "")}
              onChange={handleRangeChange}
            />
          </div>
          <p className="text-sm text-text-muted sm:ml-auto">
            {hasCustomRange ? "Showing a custom range." : "Showing the last 30 days."}
          </p>
          {hasCustomRange && (
            <Button variant="secondary" size="sm" onClick={resetRange}>
              Last 30 days
            </Button>
          )}
        </div>
      </Card>

      {isPending && (
        <>
          <StatCardsSkeleton />
          <div className="grid gap-6 lg:grid-cols-5">
            <ChartCardSkeleton className="lg:col-span-3" height={320} />
            <ChartCardSkeleton className="lg:col-span-2" height={320} />
          </div>
          <ChartCardSkeleton height={300} />
        </>
      )}
      {isError && (
        <Card>
          <ErrorState
            message={
              error instanceof ApiError && error.status === BAD_REQUEST_STATUS
                ? error.message
                : undefined
            }
            onRetry={() => refetch()}
            retrying={isFetching}
          />
        </Card>
      )}

      {data && (
        <>
          <StatCards stats={data} />
          <div className="grid gap-6 lg:grid-cols-5">
            <ChartCard
              className="lg:col-span-3"
              title="Patients per doctor"
              description="Doctors with the most patients (top 10)."
              isEmpty={data.patientsPerDoctor.length === 0}
              emptyIcon={Users}
              emptyTitle="No patients yet"
              emptyDescription="Add patients to a doctor to see the distribution."
              isRefreshing={isRefreshing}
            >
              <PatientsPerDoctorChart data={data.patientsPerDoctor} />
            </ChartCard>
            <ChartCard
              className="lg:col-span-2"
              title="Patients by condition"
              description="Current condition of all patients."
              isEmpty={noPatients}
              emptyIcon={ChartPie}
              emptyTitle="No patients yet"
              emptyDescription="Conditions appear once patients are added."
              isRefreshing={isRefreshing}
            >
              <ConditionChart data={data.patientsByCondition} />
            </ChartCard>
          </div>
          <ChartCard
            title="New patients & doctors over time"
            description="Records added per day in the selected range."
            isEmpty={data.dateStats.length === 0}
            emptyIcon={Activity}
            emptyTitle="No activity in this range"
            emptyDescription="Pick a different date range."
            isRefreshing={isRefreshing}
          >
            <ActivityChart data={data.dateStats} />
          </ChartCard>
        </>
      )}
    </>
  );
};
