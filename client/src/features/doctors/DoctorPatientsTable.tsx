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

const DoctorPatientsTableComponent = ({ patients, onDelete }: DoctorPatientsTableProps) => (
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
);

export const DoctorPatientsTable = memo(DoctorPatientsTableComponent);
