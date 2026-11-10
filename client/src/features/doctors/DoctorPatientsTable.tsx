import { Trash2 } from "lucide-react";
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
import type { DoctorPatient } from "./doctors.types";

interface DoctorPatientsTableProps {
  patients: DoctorPatient[];
  onDelete: (patient: DoctorPatient) => void;
}

interface RowProps {
  patient: DoctorPatient;
  onDelete: (patient: DoctorPatient) => void;
}

const PatientRow = memo(({ patient, onDelete }: RowProps) => (
  <TableRow>
    <TableCell className="font-medium whitespace-nowrap">{patient.name}</TableCell>
    <TableCell className="whitespace-nowrap">{patient.phone}</TableCell>
    <TableCell>
      <ConditionBadge condition={patient.condition} />
    </TableCell>
    <TableCell className="whitespace-nowrap text-text-muted">{formatDate(patient.createdAt)}</TableCell>
    <TableCell className="text-right">
      <Button
        variant="ghost"
        size="icon"
        className="size-8 text-danger-text hover:bg-danger-soft hover:text-danger-text"
        onClick={() => onDelete(patient)}
        aria-label={`Delete ${patient.name}`}
      >
        <Trash2 aria-hidden className="size-4" />
      </Button>
    </TableCell>
  </TableRow>
));
PatientRow.displayName = "PatientRow";

const PatientCard = memo(({ patient, onDelete }: RowProps) => (
  <li className="flex items-start justify-between gap-3 p-4">
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className="truncate font-medium text-text">{patient.name}</span>
      <span className="text-sm text-text-muted">{patient.phone}</span>
      <div className="flex flex-wrap items-center gap-2">
        <ConditionBadge condition={patient.condition} />
        <span className="text-xs text-text-muted">Added {formatDate(patient.createdAt)}</span>
      </div>
    </div>
    <Button
      variant="ghost"
      size="icon"
      className="size-8 shrink-0 text-danger-text hover:bg-danger-soft hover:text-danger-text"
      onClick={() => onDelete(patient)}
      aria-label={`Delete ${patient.name}`}
    >
      <Trash2 aria-hidden className="size-4" />
    </Button>
  </li>
));
PatientCard.displayName = "PatientCard";

const DoctorPatientsTableComponent = ({ patients, onDelete }: DoctorPatientsTableProps) => (
  <>
    <div className="hidden md:block">
      <Table>
        <TableHead>
          <tr>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Phone</TableHeaderCell>
            <TableHeaderCell>Condition</TableHeaderCell>
            <TableHeaderCell>Added</TableHeaderCell>
            <TableHeaderCell className="text-right">
              <span className="sr-only">Actions</span>
            </TableHeaderCell>
          </tr>
        </TableHead>
        <TableBody>
          {patients.map((patient) => (
            <PatientRow key={patient.id} patient={patient} onDelete={onDelete} />
          ))}
        </TableBody>
      </Table>
    </div>
    <ul className="divide-y divide-border md:hidden">
      {patients.map((patient) => (
        <PatientCard key={patient.id} patient={patient} onDelete={onDelete} />
      ))}
    </ul>
  </>
);

export const DoctorPatientsTable = memo(DoctorPatientsTableComponent);
