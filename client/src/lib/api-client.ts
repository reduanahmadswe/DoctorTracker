import { LOGIN_PATH } from "@/lib/constants";
import { buildQueryString } from "@/lib/utils";
import type { ApiFailure, ApiSuccess, FieldError, PaginationMeta } from "@/types/api";

// Requests use relative "/api/v1/..." paths; next.config.ts proxies them to the Express server,
// which keeps the auth cookie first-party to the client domain.
const API_BASE = "/api/v1";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly errors?: FieldError[],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ApiResult<T> {
  data: T;
  meta?: PaginationMeta;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  params?: Record<string, string | number | boolean | null | undefined>;
  signal?: AbortSignal;
  // Set for requests (like login) where a 401 is an expected answer, not an expired session.
  skipUnauthorizedRedirect?: boolean;
}

// An expired or invalid cookie would make the proxy bounce /login back to /dashboard, so the
// server is asked to clear it first (logout is idempotent) and only then is /login opened.
const redirectToLogin = (): void => {
  if (typeof window === "undefined" || window.location.pathname === LOGIN_PATH) return;
  void fetch(`${API_BASE}/auth/logout`, { method: "POST", credentials: "include" })
    .catch(() => undefined)
    .finally(() => window.location.assign(LOGIN_PATH));
};

const parseBody = async (response: Response): Promise<ApiSuccess<unknown> | ApiFailure | null> => {
  try {
    return (await response.json()) as ApiSuccess<unknown> | ApiFailure;
  } catch {
    return null;
  }
};

const apiRequest = async <T>(
  path: string,
  { method = "GET", body, params, signal, skipUnauthorizedRedirect }: RequestOptions = {},
): Promise<ApiResult<T>> => {
  const response = await fetch(`${API_BASE}${path}${buildQueryString(params ?? {})}`, {
    method,
    credentials: "include",
    signal,
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const payload = await parseBody(response);

  if (response.status === 401 && !skipUnauthorizedRedirect) redirectToLogin();

  if (!response.ok || !payload || !payload.success) {
    const failure = payload && !payload.success ? payload : null;
    throw new ApiError(
      response.status,
      failure?.message ?? "Something went wrong. Please try again.",
      failure?.errors,
    );
  }

  return { data: payload.data as T, meta: payload.meta };
};

export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    apiRequest<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    apiRequest<T>(path, { ...options, method: "POST", body }),
  patch: <T>(path: string, body: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    apiRequest<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    apiRequest<T>(path, { ...options, method: "DELETE" }),
};
