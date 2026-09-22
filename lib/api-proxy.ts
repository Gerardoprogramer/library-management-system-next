import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function backendProxy(
  request: NextRequest,
  endpoint: string,
  options: { method?: string; body?: unknown } = {}
) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const { searchParams } = new URL(request.url);

    const backendBaseUrl = process.env.BACKEND_URL?.trim().replace(/\/+$/, "");

    if (!backendBaseUrl) {
      throw new Error("BACKEND_URL no está configurada en el entorno de producción");
    }

    const backendPath = backendBaseUrl.endsWith("/api/v1")
      ? endpoint
      : `/api/v1${endpoint}`;
    const backendUrl = new URL(`${backendBaseUrl}${backendPath}`);

    searchParams.forEach((value, key) => backendUrl.searchParams.append(key, value));

    const headers = new Headers({
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    });

    const csrfToken = request.headers.get("X-XSRF-TOKEN");

    if (csrfToken) {
      headers.set("X-XSRF-TOKEN", csrfToken);
    }

    const fetchOptions: RequestInit = {
      method: options.method || request.method,
      headers,
      cache: "no-store",
    };

    if (options.body !== undefined) {
      fetchOptions.body = JSON.stringify(options.body);
    } else if (request.method !== "GET" && request.method !== "HEAD") {
      const body = await request.json().catch(() => null);

      if (body) {
        fetchOptions.body = JSON.stringify(body);
      }
    }

    const backendResponse = await fetch(backendUrl.toString(), fetchOptions);

    const responseText = backendResponse.status !== 204 ? await backendResponse.text() : "";
    let data: unknown = null;

    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { success: false, message: responseText };
      }
    }

    const response = NextResponse.json(data, {
      status: backendResponse.status,
    });

    const setCookies = backendResponse.headers.getSetCookie();

    for (const cookie of setCookies) {
      response.headers.append("Set-Cookie", cookie);
    }

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";

    console.error(`[Proxy Error] ${endpoint}: ${message}`);

    return NextResponse.json(
      {
        success: false,
        message: "No se pudo conectar con el backend",
      },
      {
        status: 500,
      }
    );
  }
}
