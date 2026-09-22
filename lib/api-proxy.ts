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

    const configuredBackendUrl = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!configuredBackendUrl) {
      throw new Error("Falta BACKEND_URL en las variables de entorno de Vercel");
    }

    const backendBaseUrl = configuredBackendUrl.trim().replace(/\/+$/, "");
    const backendUrl = new URL(
      backendBaseUrl.endsWith("/api/v1")
        ? `${backendBaseUrl}${endpoint}`
        : `${backendBaseUrl}/api/v1${endpoint}`
    );

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

    const data = backendResponse.status !== 204 ? await backendResponse.json().catch(() => null) : null;

    const response = NextResponse.json(data, {
      status: backendResponse.status,
    });

    const headersWithSetCookie = backendResponse.headers as Headers & {
      getSetCookie?: () => string[];
    };
    const setCookies = headersWithSetCookie.getSetCookie?.() ?? [];

    if (setCookies.length === 0) {
      const setCookie = backendResponse.headers.get("set-cookie");

      if (setCookie) {
        setCookies.push(setCookie);
      }
    }

    for (const cookie of setCookies) {
      response.headers.append("Set-Cookie", cookie);
    }

    return response;
  } catch (error) {
    console.error(`[Proxy Error] ${endpoint}:`, error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Error de comunicación con el backend",
      },
      {
        status: 500,
      }
    );
  }
}
