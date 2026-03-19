import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname === "/" ||
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register");

  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard && !accessToken) {
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(new URL("/api/auth/refresh", request.url), {
          method: "POST",
          headers: { Cookie: request.headers.get("cookie") || "" },
        });

        if (refreshResponse.ok) {
          const response = NextResponse.next();

          const setCookie = refreshResponse.headers.get("set-cookie");
          if (setCookie) {
            response.headers.set("set-cookie", setCookie);
          }

          return response;
        }
      } catch (error) {
        console.error("Error en el auto-refresh del proxy:", error);
      }
    }

    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};