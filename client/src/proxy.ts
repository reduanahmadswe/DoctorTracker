import { type NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, LOGIN_PATH } from "@/lib/constants";
import { DEFAULT_AFTER_LOGIN_PATH } from "@/lib/safe-redirect";

// Optimistic check only: it looks at cookie presence to avoid rendering the shell for visitors
// without a session. The real verification is GET /auth/me in the dashboard layout.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasToken = request.cookies.has(AUTH_COOKIE_NAME);

  if (pathname === LOGIN_PATH) {
    return hasToken
      ? NextResponse.redirect(new URL(DEFAULT_AFTER_LOGIN_PATH, request.url))
      : NextResponse.next();
  }

  if (!hasToken) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*", "/doctors/:path*", "/patients/:path*"],
};
