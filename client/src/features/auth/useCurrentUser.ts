"use client";

import { useQuery } from "@tanstack/react-query";
import { authKeys, fetchCurrentUser } from "./auth.api";

const SESSION_STALE_TIME_MS = 5 * 60 * 1000;

// The server is the source of truth for the session; the cookie alone is never trusted.
export const useCurrentUser = () =>
  useQuery({
    queryKey: authKeys.me,
    queryFn: ({ signal }) => fetchCurrentUser(signal),
    staleTime: SESSION_STALE_TIME_MS,
    retry: false,
  });
