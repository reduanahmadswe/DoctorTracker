import type { Metadata } from "next";
import { Suspense } from "react";
import { DoctorsView } from "@/features/doctors/DoctorsView";

export const metadata: Metadata = { title: "Doctors" };

export default function DoctorsPage() {
  // useSearchParams() (list state in the URL) needs a Suspense boundary.
  return (
    <Suspense fallback={null}>
      <DoctorsView />
    </Suspense>
  );
}
