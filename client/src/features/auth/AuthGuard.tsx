"use client";

import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api-client";
import { useCurrentUser } from "./useCurrentUser";

const UNAUTHORIZED_STATUS = 401;

// Renders the app only after the server confirmed the session. A 401 is handled by the API
// client (clears the cookie and goes to /login); other failures offer a retry.
export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { data: user, error, refetch, isFetching } = useCurrentUser();

  if (user) return children;

  const isSessionError = error instanceof ApiError && error.status === UNAUTHORIZED_STATUS;
  if (error && !isSessionError) {
    return (
      <div role="alert" className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <p className="text-sm text-text-muted">We could not verify your session.</p>
        <Button variant="secondary" onClick={() => refetch()} loading={isFetching}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div role="status" className="flex min-h-screen items-center justify-center">
      <Loader2 aria-hidden className="size-6 animate-spin text-primary" />
      <span className="sr-only">Checking your session</span>
    </div>
  );
};
