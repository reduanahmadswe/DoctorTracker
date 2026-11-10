import { CalendarDays, Hospital, Mail, Phone, Stethoscope } from "lucide-react";
import type { ReactNode } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDate } from "@/lib/format";
import type { Doctor } from "./doctors.types";

const Detail = ({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) => (
  <div className="flex items-start gap-3">
    <span aria-hidden className="mt-0.5 text-text-muted">
      {icon}
    </span>
    <div className="flex min-w-0 flex-col">
      <dt className="text-xs text-text-muted">{label}</dt>
      <dd className="text-sm font-medium break-words text-text">{children}</dd>
    </div>
  </div>
);

export const DoctorProfileCard = ({ doctor }: { doctor: Doctor }) => (
  <Card>
    <CardContent className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Avatar name={doctor.name} className="size-14 text-base" />
        <div className="flex flex-col items-start gap-1.5">
          <h1 className="text-2xl font-semibold text-text">{doctor.name}</h1>
          <Badge variant="primary">{doctor.specialization}</Badge>
        </div>
      </div>
      <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Detail icon={<Stethoscope className="size-4" />} label="Specialization">
          {doctor.specialization}
        </Detail>
        <Detail icon={<Hospital className="size-4" />} label="Hospital">
          {doctor.hospital}
        </Detail>
        <Detail icon={<Phone className="size-4" />} label="Phone">
          {doctor.phone}
        </Detail>
        <Detail icon={<Mail className="size-4" />} label="Email">
          {doctor.email}
        </Detail>
        <Detail icon={<CalendarDays className="size-4" />} label="Added on">
          {formatDate(doctor.createdAt)}
        </Detail>
      </dl>
    </CardContent>
  </Card>
);

export const DoctorProfileSkeleton = () => (
  <Card>
    <CardContent className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Skeleton className="size-14 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-10" />
        ))}
      </div>
    </CardContent>
  </Card>
);
