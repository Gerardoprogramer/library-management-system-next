import { NextRequest } from "next/server";
import { backendProxy } from "@/lib/api-proxy";

export async function POST(request: NextRequest) {
  try {
    await request.text();
  } catch {}

  const response = await backendProxy(request, "/auth/logout", {
    method: "POST",
  });

  response.cookies.set("access_token", "", {
    httpOnly: true,
    expires: new Date(0),
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  response.cookies.set("refresh_token", "", {
    httpOnly: true,
    expires: new Date(0),
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
