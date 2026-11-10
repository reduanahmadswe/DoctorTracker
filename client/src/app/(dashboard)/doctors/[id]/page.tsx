import type { Metadata } from "next";
import { Suspense } from "react";
import { DoctorDetailView } from "@/features/doctors/DoctorDetailView";

export const metadata: Metadata = { title: "Doctor details" };

export default async function DoctorDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // useSearchParams() (page and back link in the URL) needs a Suspense boundary.
  return (
    <Suspense fallback={null}>
      <DoctorDetailView doctorId={id} />
    </Suspense>
  );
}
