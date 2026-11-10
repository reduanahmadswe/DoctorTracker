"use client";

import { Stethoscope } from "lucide-react";
import { useCallback, useMemo } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Pagination } from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { parsePageParam, useUrlParams } from "@/lib/use-url-params";
import type { DoctorListFilters } from "./doctors.types";
import { DoctorsTable } from "./DoctorsTable";
import { DoctorsToolbar } from "./DoctorsToolbar";
import { useDoctorFilterOptions, useDoctors } from "./useDoctorQueries";

const CLEARED_FILTERS = { q: "", specialization: "", hospital: "", from: "", to: "" };

export const DoctorsView = () => {
  const { searchParams, update } = useUrlParams();

  const filters = useMemo<DoctorListFilters>(
    () => ({
      q: searchParams.get("q") ?? "",
      specialization: searchParams.get("specialization") ?? "",
      hospital: searchParams.get("hospital") ?? "",
      from: searchParams.get("from") ?? "",
      to: searchParams.get("to") ?? "",
      page: parsePageParam(searchParams.get("page")),
    }),
    [searchParams],
  );
  const hasActiveFilters = Boolean(
    filters.q || filters.specialization || filters.hospital || filters.from || filters.to,
  );
  const returnTo = searchParams.toString();

  const doctorsQuery = useDoctors(filters);
  const optionsQuery = useDoctorFilterOptions();

  const handleFilterChange = useCallback(
    (updates: Partial<Omit<DoctorListFilters, "page">>) => update(updates, { resetPage: true }),
    [update],
  );
  const handleClear = useCallback(() => update(CLEARED_FILTERS, { resetPage: true }), [update]);
  const handlePageChange = useCallback((page: number) => update({ page }), [update]);

  const { data, isPending, isError, isFetching, isPlaceholderData, refetch } = doctorsQuery;

  return (
    <>
      <PageHeader title="Doctors" description="Browse doctors and manage their patients." />
      <DoctorsToolbar
        filters={filters}
        options={optionsQuery.data}
        hasActiveFilters={hasActiveFilters}
        onChange={handleFilterChange}
        onClear={handleClear}
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
                <Button variant="secondary" onClick={handleClear}>
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
            <DoctorsTable doctors={data.items} returnTo={returnTo} />
            <Pagination meta={data.meta} onPageChange={handlePageChange} isFetching={isFetching} />
          </div>
        )}
      </Card>
    </>
  );
};
