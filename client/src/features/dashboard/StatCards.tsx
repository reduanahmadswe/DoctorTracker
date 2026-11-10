import { Activity, Stethoscope, UserPlus, Users, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import type { DashboardStats } from "./dashboard.types";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

const StatCard = ({ icon: Icon, label, value }: StatCardProps) => (
  <Card>
    <CardContent className="flex items-center gap-4 p-5">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
        <Icon aria-hidden className="size-6" />
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="text-3xl font-semibold text-text tabular-nums">{value}</span>
        <span className="truncate text-sm text-text-muted">{label}</span>
      </div>
    </CardContent>
  </Card>
);

const formatCount = (value: number): string => value.toLocaleString("en-US");

// Average patients per doctor is derived from the totals; 0 doctors means no average yet.
export const calculateAveragePatients = (doctors: number, patients: number): number =>
  doctors === 0 ? 0 : patients / doctors;

export const StatCards = ({ stats }: { stats: DashboardStats }) => {
  const { totals, dateStats } = stats;
  const addedInRange = dateStats.reduce((sum, day) => sum + day.patients, 0);
  const average = calculateAveragePatients(totals.doctors, totals.patients);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard icon={Stethoscope} label="Total doctors" value={formatCount(totals.doctors)} />
      <StatCard icon={Users} label="Total patients" value={formatCount(totals.patients)} />
      <StatCard icon={Activity} label="Avg. patients per doctor" value={average.toFixed(1)} />
      <StatCard icon={UserPlus} label="Patients added in range" value={formatCount(addedInRange)} />
    </div>
  );
};

export const StatCardsSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {Array.from({ length: 4 }, (_, index) => (
      <Card key={index}>
        <CardContent className="flex items-center gap-4 p-5">
          <Skeleton className="size-12 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);
