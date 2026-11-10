import { api } from "@/lib/api-client";
import type { AuthUser } from "./auth.types";
import type { LoginValues } from "./auth.schemas";

export const authKeys = {
  me: ["auth", "me"] as const,
};

// A 401 on login means "wrong credentials", so it must not trigger the expired-session redirect.
export const login = async (values: LoginValues): Promise<AuthUser> =>
  (await api.post<AuthUser>("/auth/login", values, { skipUnauthorizedRedirect: true })).data;

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout", undefined, { skipUnauthorizedRedirect: true });
};

export const fetchCurrentUser = async (signal?: AbortSignal): Promise<AuthUser> =>
  (await api.get<AuthUser>("/auth/me", { signal })).data;
