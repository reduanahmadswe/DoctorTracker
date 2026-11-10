"use client";

import { Plus, Stethoscope } from "lucide-react";
import { useCallback, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Pagination } from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { useListParams } from "@/lib/use-list-params";
import { CreateDoctorDialog } from "./CreateDoctorDialog";
import { DoctorsTable } from "./DoctorsTable";
import { DoctorsToolbar } from "./DoctorsToolbar";
import { useDoctorFilterOptions, useDoctors } from "./useDoctorQueries";

const FILTER_KEYS = ["q", "specialization", "hospital", "from", "to"] as const;

export const DoctorsView = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const { filters, hasActiveFilters, changeFilters, clearFilters, changePage, queryString } =
    useListParams(FILTER_KEYS);

  const doctorsQuery = useDoctors(filters);
  const optionsQuery = useDoctorFilterOptions();
  const closeCreate = useCallback(() => setCreateOpen(false), []);

  const { data, isPending, isError, isFetching, isPlaceholderData, refetch } = doctorsQuery;

  return (
    <>
      <PageHeader
        title="Doctors"
        description="Browse doctors and manage their patients."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus aria-hidden className="size-4" />
            Add Doctor
          </Button>
        }
      />
      <DoctorsToolbar
        filters={filters}
        options={optionsQuery.data}
        hasActiveFilters={hasActiveFilters}
        onChange={changeFilters}
        onClear={clearFilters}
      />
      <Card className="overflow-hidden">
        {isPending && <TableSkeleton columns={6} rows={6} />}
        {isError && <ErrorState onRetry={() => refetch()} retrying={isFetching} />}
        {data && data.items.length === 0 && (
          <EmptyState
            icon={Stethoscope}
            title="No doctors found"
            description={
              hasActiveFilters
                ? "No doctors match your search or filters."
                : "Add your first doctor to get started."
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
            <DoctorsTable doctors={data.items} returnTo={queryString} />
            <Pagination meta={data.meta} onPageChange={changePage} isFetching={isFetching} />
          </div>
        )}
      </Card>
      <CreateDoctorDialog open={createOpen} onClose={closeCreate} />
    </>
  );
};
