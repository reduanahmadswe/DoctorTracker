import type { Metadata } from "next";
import { Brand } from "@/components/layout/Brand";
import { Card, CardContent } from "@/components/ui/Card";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <Brand />
        <Card className="w-full">
          <CardContent className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold text-text">Sign in</h1>
            <p className="text-sm text-text-muted">The sign-in form is added with authentication.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
