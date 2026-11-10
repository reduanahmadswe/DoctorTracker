import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardView } from "@/features/dashboard/DashboardView";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  // useSearchParams() (the date range in the URL) needs a Suspense boundary.
  return (
    <Suspense fallback={null}>
      <DashboardView />
    </Suspense>
  );
}
