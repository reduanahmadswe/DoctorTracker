import { SearchX } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <EmptyState
        icon={SearchX}
        title="Page not found"
        description="The page you are looking for does not exist or was moved."
        action={
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center rounded-control bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            Go to dashboard
          </Link>
        }
      />
    </main>
  );
}
