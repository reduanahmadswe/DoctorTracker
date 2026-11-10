import { Eye, Mail, Phone, Stethoscope, Users } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/Table";
import { formatDate } from "@/lib/format";
import type { DoctorListItem } from "./doctors.types";

interface DoctorsTableProps {
  doctors: DoctorListItem[];
  // Raw query string of the list, passed on so the detail page can link back to the same view.
  returnTo: string;
}

const detailHref = (id: string, returnTo: string): string =>
  returnTo ? `/doctors/${id}?returnTo=${encodeURIComponent(returnTo)}` : `/doctors/${id}`;

const viewLinkClassName =
  "inline-flex h-8 items-center gap-1.5 rounded-control border border-border bg-surface px-3 text-sm font-medium text-text transition-colors hover:bg-primary-soft";

interface RowProps {
  doctor: DoctorListItem;
  returnTo: string;
}

const DoctorRow = memo(({ doctor, returnTo }: RowProps) => (
  <TableRow>
    <TableCell>
      <div className="flex items-center gap-3">
        <Avatar name={doctor.name} />
        <span className="font-medium whitespace-nowrap">{doctor.name}</span>
      </div>
    </TableCell>
    <TableCell>
      <Badge variant="primary">{doctor.specialization}</Badge>
    </TableCell>
    <TableCell>{doctor.hospital}</TableCell>
    <TableCell className="whitespace-nowrap">{doctor.phone}</TableCell>
    <TableCell>{doctor.email}</TableCell>
    <TableCell className="text-center">{doctor.patientCount}</TableCell>
    <TableCell className="whitespace-nowrap text-text-muted">{formatDate(doctor.createdAt)}</TableCell>
    <TableCell className="text-right">
      <Link
        href={detailHref(doctor.id, returnTo)}
        className={viewLinkClassName}
        aria-label={`View ${doctor.name}`}
      >
        <Eye aria-hidden className="size-4" />
        View
      </Link>
    </TableCell>
  </TableRow>
));
DoctorRow.displayName = "DoctorRow";

const DoctorCard = memo(({ doctor, returnTo }: RowProps) => (
  <li className="flex flex-col gap-3 p-4">
    <div className="flex items-center gap-3">
      <Avatar name={doctor.name} className="size-10" />
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-medium text-text">{doctor.name}</span>
        <span className="text-xs text-text-muted">Added {formatDate(doctor.createdAt)}</span>
      </div>
    </div>
    <dl className="grid gap-1.5 text-sm text-text-muted">
      <div className="flex items-center gap-2">
        <Stethoscope aria-hidden className="size-4 shrink-0" />
        <dt className="sr-only">Specialization and hospital</dt>
        <dd className="min-w-0">
          {doctor.specialization} · {doctor.hospital}
        </dd>
      </div>
      <div className="flex items-center gap-2">
        <Phone aria-hidden className="size-4 shrink-0" />
        <dt className="sr-only">Phone</dt>
        <dd>{doctor.phone}</dd>
      </div>
      <div className="flex items-center gap-2">
        <Mail aria-hidden className="size-4 shrink-0" />
        <dt className="sr-only">Email</dt>
        <dd className="min-w-0 break-all">{doctor.email}</dd>
      </div>
      <div className="flex items-center gap-2">
        <Users aria-hidden className="size-4 shrink-0" />
        <dt className="sr-only">Patients</dt>
        <dd>
          {doctor.patientCount} {doctor.patientCount === 1 ? "patient" : "patients"}
        </dd>
      </div>
    </dl>
    <Link href={detailHref(doctor.id, returnTo)} className={`${viewLinkClassName} justify-center`}>
      <Eye aria-hidden className="size-4" />
      View
    </Link>
  </li>
));
DoctorCard.displayName = "DoctorCard";

const DoctorsTableComponent = ({ doctors, returnTo }: DoctorsTableProps) => (
  <>
    <div className="hidden md:block">
      <Table>
        <TableHead>
          <tr>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Specialization</TableHeaderCell>
            <TableHeaderCell>Hospital</TableHeaderCell>
            <TableHeaderCell>Phone</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell className="text-center">Patients</TableHeaderCell>
            <TableHeaderCell>Created</TableHeaderCell>
            <TableHeaderCell className="text-right">Action</TableHeaderCell>
          </tr>
        </TableHead>
        <TableBody>
          {doctors.map((doctor) => (
            <DoctorRow key={doctor.id} doctor={doctor} returnTo={returnTo} />
          ))}
        </TableBody>
      </Table>
    </div>
    <ul className="divide-y divide-border md:hidden">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} returnTo={returnTo} />
      ))}
    </ul>
  </>
);

export const DoctorsTable = memo(DoctorsTableComponent);
