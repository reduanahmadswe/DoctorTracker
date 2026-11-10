"use client";

import { UserRound } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Pagination } from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { useListParams } from "@/lib/use-list-params";
import { useStepBackOnEmptyPage } from "@/lib/use-step-back-on-empty-page";
import { cn } from "@/lib/utils";
import { EditPatientDialog } from "./EditPatientDialog";
import type { Patient } from "./patients.types";
import { PatientsTable } from "./PatientsTable";
import { PatientsToolbar } from "./PatientsToolbar";
import { useDeletePatient } from "./usePatientMutations";
import { usePatients } from "./usePatients";

const FILTER_KEYS = ["q", "condition", "doctor", "from", "to"] as const;

export const PatientsView = () => {
  const { filters, hasActiveFilters, changeFilters, clearFilters, changePage } =
    useListParams(FILTER_KEYS);
  const { data, isPending, isError, isFetching, isPlaceholderData, refetch } = usePatients(filters);

  const deletePatient = useDeletePatient();
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  const handleEdit = useCallback((patient: Patient) => setPatientToEdit(patient), []);
  const handleDelete = useCallback((patient: Patient) => setPatientToDelete(patient), []);
  const closeEdit = useCallback(() => setPatientToEdit(null), []);
  const cancelDelete = useCallback(() => setPatientToDelete(null), []);

  const confirmDelete = () => {
    if (!patientToDelete) return;
    deletePatient.mutate(patientToDelete.id);
    setPatientToDelete(null);
  };

  const isEmptyPage = useStepBackOnEmptyPage(data?.items.length, filters.page, changePage);

  return (
    <>
      <PageHeader
        title="Patients"
        description="All patients across every doctor."
        actions={
          <p className="text-sm text-text-muted">
            New patients are added from a{" "}
            <Link href="/doctors" className="font-medium text-primary hover:underline">
              doctor&apos;s page
            </Link>
            .
          </p>
        }
      />
      <PatientsToolbar
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        onChange={changeFilters}
        onClear={clearFilters}
      />
      <Card className="overflow-hidden">
        {isPending && <TableSkeleton columns={6} rows={6} />}
        {isError && <ErrorState onRetry={() => refetch()} retrying={isFetching} />}
        {data && data.items.length === 0 && !isEmptyPage && (
          <EmptyState
            icon={UserRound}
            title="No patients found"
            description={
              hasActiveFilters
                ? "No patients match your search or filters."
                : "Patients you add under a doctor will show up here."
            }
            action={
              hasActiveFilters ? (
                <Button variant="secondary" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : undefined
            }
          />
        )}
        {data && data.items.length > 0 && (
          <div
            aria-busy={isPlaceholderData}
            className={cn("transition-opacity", isPlaceholderData && "opacity-60")}
          >
            <PatientsTable patients={data.items} onEdit={handleEdit} onDelete={handleDelete} />
            <Pagination meta={data.meta} onPageChange={changePage} isFetching={isFetching} />
          </div>
        )}
      </Card>
      <EditPatientDialog patient={patientToEdit} onClose={closeEdit} />
      <ConfirmDialog
        open={patientToDelete !== null}
        title="Delete patient"
        description={`Delete ${patientToDelete?.name ?? "this patient"}? This cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
};
