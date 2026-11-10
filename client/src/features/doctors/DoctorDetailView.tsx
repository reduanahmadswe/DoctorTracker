"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ErrorState } from "@/components/ui/ErrorState";
import { Card } from "@/components/ui/Card";
import { ApiError } from "@/lib/api-client";
import { DoctorPatientsSection } from "./DoctorPatientsSection";
import { DoctorProfileCard, DoctorProfileSkeleton } from "./DoctorProfileCard";
import { useDoctor } from "./useDoctorQueries";

const NOT_FOUND_STATUS = 404;
const BAD_REQUEST_STATUS = 400;

export const DoctorDetailView = ({ doctorId }: { doctorId: string }) => {
  const searchParams = useSearchParams();
  // The list passes its own query string along so "Back" restores the same search and page.
  const returnTo = searchParams.get("returnTo");
  const backHref = returnTo ? `/doctors?${returnTo}` : "/doctors";

  const { data: doctor, error, isPending, isFetching, refetch } = useDoctor(doctorId);
  const isMissing =
    error instanceof ApiError &&
    (error.status === NOT_FOUND_STATUS || error.status === BAD_REQUEST_STATUS);

  return (
    <>
      <Link
        href={backHref}
        className="inline-flex w-fit items-center gap-2 rounded-control text-sm font-medium text-text-muted transition-colors hover:text-text"
      >
        <ArrowLeft aria-hidden className="size-4" />
        Back to doctors
      </Link>
      {isPending && <DoctorProfileSkeleton />}
      {error && (
        <Card>
          <ErrorState
            title={isMissing ? "Doctor not found" : undefined}
            message={isMissing ? "This doctor does not exist or was removed." : undefined}
            onRetry={() => refetch()}
            retrying={isFetching}
          />
        </Card>
      )}
      {doctor && (
        <>
          <DoctorProfileCard doctor={doctor} />
          <DoctorPatientsSection doctorId={doctor.id} doctorName={doctor.name} />
        </>
      )}
    </>
  );
};
