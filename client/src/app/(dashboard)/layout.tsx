import { type ReactNode, Suspense } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { AuthGuard } from "@/features/auth/AuthGuard";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen">
        <Sidebar />
        <div className="flex min-h-screen flex-col lg:pl-64">
          {/* usePathname() reads the URL at request time on dynamic routes, so it needs Suspense. */}
          <Suspense fallback={<div className="h-16 border-b border-border bg-surface" />}>
            <Topbar />
          </Suspense>
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">{children}</div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
