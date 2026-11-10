import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/lib/api-client";

const STALE_TIME_MS = 30_000;
const MAX_RETRIES = 2;

// Client errors (4xx) will not succeed on retry; only transient failures are retried.
const shouldRetry = (failureCount: number, error: Error): boolean =>
  !(error instanceof ApiError && error.status < 500) && failureCount < MAX_RETRIES;

const createQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIME_MS,
        refetchOnWindowFocus: false,
        retry: shouldRetry,
      },
    },
  });

let browserQueryClient: QueryClient | undefined;

// One client per server render (no cross-request leaks), one shared client in the browser.
export const getQueryClient = (): QueryClient => {
  if (typeof window === "undefined") return createQueryClient();
  browserQueryClient ??= createQueryClient();
  return browserQueryClient;
};
