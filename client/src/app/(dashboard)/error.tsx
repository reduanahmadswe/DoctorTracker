"use client";

import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";

// Catches unexpected rendering errors inside the app shell so the sidebar stays usable.
export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
  return (
    <Card>
      <ErrorState onRetry={reset} />
    </Card>
  );
}
