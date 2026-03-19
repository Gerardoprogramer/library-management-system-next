import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No hay refresh token" }, { status: 401 });
  }

  try {
    const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Cookie": `refresh_token=${refreshToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!backendResponse.ok) {
      return NextResponse.json({ error: "Backend rechazó el refresh" }, { status: 401 });
    }

    const data = await backendResponse.json();

    const response = NextResponse.json(data);

    const setCookieHeader = backendResponse.headers.get("set-cookie");
    if (setCookieHeader) {
      response.headers.set("set-cookie", setCookieHeader);
    }

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Error de conexión" }, { status: 500 });
  }
}