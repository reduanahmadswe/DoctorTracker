"use client";

import { Plus, UserRound } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Pagination } from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { parsePageParam, useUrlParams } from "@/lib/use-url-params";
import { AddPatientDialog } from "./AddPatientDialog";
import { DoctorPatientsTable } from "./DoctorPatientsTable";
import type { DoctorPatient } from "./doctors.types";
import { useDoctorPatients } from "./useDoctorQueries";
import { useRemovePatient } from "./useDoctorPatientMutations";

interface DoctorPatientsSectionProps {
  doctorId: string;
  doctorName: string;
}

export const DoctorPatientsSection = ({ doctorId, doctorName }: DoctorPatientsSectionProps) => {
  const { searchParams, update } = useUrlParams();
  const page = parsePageParam(searchParams.get("page"));
  const [addOpen, setAddOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<DoctorPatient | null>(null);

  const { data, isPending, isError, isFetching, isPlaceholderData, refetch } = useDoctorPatients(
    doctorId,
    page,
  );
  const removePatient = useRemovePatient(doctorId);

  const handlePageChange = useCallback((next: number) => update({ page: next }), [update]);
  const closeAdd = useCallback(() => setAddOpen(false), []);
  const requestDelete = useCallback((patient: DoctorPatient) => setPatientToDelete(patient), []);
  const cancelDelete = useCallback(() => setPatientToDelete(null), []);

  const confirmDelete = () => {
    if (!patientToDelete) return;
    removePatient.mutate(patientToDelete.id);
    setPatientToDelete(null);
  };

  // Deleting the last patient of a page leaves it empty: step back to the previous page.
  const isEmptyPage = data !== undefined && data.items.length === 0 && page > 1;
  useEffect(() => {
    if (isEmptyPage) update({ page: page - 1 });
  }, [isEmptyPage, page, update]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex-row items-center justify-between gap-4 pb-4">
        <CardTitle>
          Patients{data ? ` (${data.meta.total})` : ""}
        </CardTitle>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus aria-hidden className="size-4" />
          Add Patient
        </Button>
      </CardHeader>
      {isPending && <TableSkeleton columns={5} rows={4} />}
      {isError && <ErrorState onRetry={() => refetch()} retrying={isFetching} />}
      {data && data.items.length === 0 && !isEmptyPage && (
        <EmptyState
          icon={UserRound}
          title="No patients yet"
          description={`${doctorName} has no patients. Add the first one.`}
        />
      )}
      {data && data.items.length > 0 && (
        <div
          aria-busy={isPlaceholderData}
          className={cn("transition-opacity", isPlaceholderData && "opacity-60")}
        >
          <DoctorPatientsTable patients={data.items} onDelete={requestDelete} />
          <Pagination meta={data.meta} onPageChange={handlePageChange} isFetching={isFetching} />
        </div>
      )}
      <AddPatientDialog doctorId={doctorId} doctorName={doctorName} open={addOpen} onClose={closeAdd} />
      <ConfirmDialog
        open={patientToDelete !== null}
        title="Delete patient"
        description={`Remove ${patientToDelete?.name ?? "this patient"} from ${doctorName}'s patient list? This cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </Card>
  );
};
