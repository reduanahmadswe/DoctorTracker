import type { Metadata } from "next";
import { Suspense } from "react";
import { Brand } from "@/components/layout/Brand";
import { Card, CardContent } from "@/components/ui/Card";
import { LoginForm } from "@/features/auth/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-sm flex-col items-center gap-8">
        <Brand />
        <Card className="w-full">
          <CardContent className="flex flex-col gap-6 p-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-semibold text-text">Welcome back</h1>
              <p className="text-sm text-text-muted">Sign in to manage doctors and patients.</p>
            </div>
            {/* useSearchParams() (the `next` redirect) needs a Suspense boundary. */}
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
