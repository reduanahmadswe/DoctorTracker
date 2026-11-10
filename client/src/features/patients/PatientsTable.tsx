import { Pencil, Phone, Stethoscope, Trash2 } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import { Button } from "@/components/ui/Button";
import { ConditionBadge } from "@/components/ui/ConditionBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/Table";
import { formatDate } from "@/lib/format";
import type { Patient } from "./patients.types";

interface PatientsTableProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

interface RowProps {
  patient: Patient;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

const doctorLinkClassName = "font-medium text-text hover:text-primary hover:underline";

const RowActions = ({ patient, onEdit, onDelete }: RowProps) => (
  <div className="flex items-center justify-end gap-1">
    <Button
      variant="ghost"
      size="icon"
      className="size-8"
      onClick={() => onEdit(patient)}
      aria-label={`Edit ${patient.name}`}
    >
      <Pencil aria-hidden className="size-4" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      className="size-8 text-danger-text hover:bg-danger-soft hover:text-danger-text"
      onClick={() => onDelete(patient)}
      aria-label={`Delete ${patient.name}`}
    >
      <Trash2 aria-hidden className="size-4" />
    </Button>
  </div>
);

const PatientRow = memo(({ patient, onEdit, onDelete }: RowProps) => (
  <TableRow>
    <TableCell className="font-medium whitespace-nowrap">{patient.name}</TableCell>
    <TableCell className="whitespace-nowrap">{patient.phone}</TableCell>
    <TableCell>
      <ConditionBadge condition={patient.condition} />
    </TableCell>
    <TableCell>
      {patient.doctor ? (
        <div className="flex flex-col">
          <Link href={`/doctors/${patient.doctor.id}`} className={doctorLinkClassName}>
            {patient.doctor.name}
          </Link>
          <span className="text-xs text-text-muted">{patient.doctor.specialization}</span>
        </div>
      ) : (
        <span className="text-text-muted">Unassigned</span>
      )}
    </TableCell>
    <TableCell className="whitespace-nowrap text-text-muted">{formatDate(patient.createdAt)}</TableCell>
    <TableCell>
      <RowActions patient={patient} onEdit={onEdit} onDelete={onDelete} />
    </TableCell>
  </TableRow>
));
PatientRow.displayName = "PatientRow";

const PatientCard = memo(({ patient, onEdit, onDelete }: RowProps) => (
  <li className="flex flex-col gap-3 p-4">
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 flex-col gap-1.5">
        <span className="truncate font-medium text-text">{patient.name}</span>
        <div className="flex flex-wrap items-center gap-2">
          <ConditionBadge condition={patient.condition} />
          <span className="text-xs text-text-muted">Added {formatDate(patient.createdAt)}</span>
        </div>
      </div>
      <RowActions patient={patient} onEdit={onEdit} onDelete={onDelete} />
    </div>
    <dl className="grid gap-1.5 text-sm text-text-muted">
      <div className="flex items-center gap-2">
        <Phone aria-hidden className="size-4 shrink-0" />
        <dt className="sr-only">Phone</dt>
        <dd>{patient.phone}</dd>
      </div>
      <div className="flex items-center gap-2">
        <Stethoscope aria-hidden className="size-4 shrink-0" />
        <dt className="sr-only">Doctor</dt>
        <dd className="min-w-0">
          {patient.doctor ? (
            <Link href={`/doctors/${patient.doctor.id}`} className={doctorLinkClassName}>
              {patient.doctor.name}
              <span className="font-normal text-text-muted"> · {patient.doctor.specialization}</span>
            </Link>
          ) : (
            "Unassigned"
          )}
        </dd>
      </div>
    </dl>
  </li>
));
PatientCard.displayName = "PatientCard";

const PatientsTableComponent = ({ patients, onEdit, onDelete }: PatientsTableProps) => (
  <>
    <div className="hidden md:block">
      <Table>
        <TableHead>
          <tr>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Phone</TableHeaderCell>
            <TableHeaderCell>Condition</TableHeaderCell>
            <TableHeaderCell>Doctor</TableHeaderCell>
            <TableHeaderCell>Added</TableHeaderCell>
            <TableHeaderCell className="text-right">Actions</TableHeaderCell>
          </tr>
        </TableHead>
        <TableBody>
          {patients.map((patient) => (
            <PatientRow key={patient.id} patient={patient} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </TableBody>
      </Table>
    </div>
    <ul className="divide-y divide-border md:hidden">
      {patients.map((patient) => (
        <PatientCard key={patient.id} patient={patient} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  </>
);

export const PatientsTable = memo(PatientsTableComponent);
