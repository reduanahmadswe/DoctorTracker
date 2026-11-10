import { LOGIN_PATH } from "@/lib/constants";

export const DEFAULT_AFTER_LOGIN_PATH = "/dashboard";

// Only same-origin relative paths are allowed, to prevent open redirects through the `next` param.
export const getSafeRedirectPath = (next: string | null | undefined): string => {
  if (!next) return DEFAULT_AFTER_LOGIN_PATH;
  const isInternalPath = next.startsWith("/") && !next.startsWith("//") && !next.includes("\\");
  const isLoginPath = next === LOGIN_PATH || next.startsWith(`${LOGIN_PATH}?`);
  return isInternalPath && !isLoginPath ? next : DEFAULT_AFTER_LOGIN_PATH;
};
