import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === "/" || pathname.startsWith("/auth");
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard && !accessToken && !refreshToken) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("reason", "session_expired");

    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/|_next/static|_next/image|images|favicon.ico|robots.txt).*)"],
};
