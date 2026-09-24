import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_WARM_WINDOW_MS = 10 * 60 * 1000;
const BACKEND_HEALTH_TIMEOUT_MS = 60_000;
const REQUEST_TIMEOUT_MS = 15_000;

let lastBackendSuccessAt = 0;
let backendWarmupRequest: Promise<void> | null = null;

function getBackendHealthUrl(backendBaseUrl: string) {
  const healthUrl = new URL(backendBaseUrl);

  healthUrl.pathname = "/actuator/health";
  healthUrl.search = "";
  healthUrl.hash = "";

  return healthUrl.toString();
}

async function ensureBackendWarm(backendBaseUrl: string) {
  const backendWasRecentlyAvailable = Date.now() - lastBackendSuccessAt < BACKEND_WARM_WINDOW_MS;

  if (backendWasRecentlyAvailable) {
    return;
  }

  if (!backendWarmupRequest) {
    backendWarmupRequest = (async () => {
      const response = await fetch(getBackendHealthUrl(backendBaseUrl), {
        method: "GET",
        cache: "no-store",
        signal: AbortSignal.timeout(BACKEND_HEALTH_TIMEOUT_MS),
      });

      if (!response.ok) {
        throw new Error(`El backend no está disponible. Health check respondió ${response.status}`);
      }

      lastBackendSuccessAt = Date.now();
    })().finally(() => {
      backendWarmupRequest = null;
    });
  }

  await backendWarmupRequest;
}

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

    if (!backendBaseUrl) {
      throw new Error("BACKEND_URL no puede estar vacío");
    }

    const backendUrl = new URL(
      backendBaseUrl.endsWith("/api/v1") ? `${backendBaseUrl}${endpoint}` : `${backendBaseUrl}/api/v1${endpoint}`
    );

    searchParams.forEach((value, key) => backendUrl.searchParams.append(key, value));

    const headers = new Headers({
      "Content-Type": "application/json",
    });

    if (cookieHeader) {
      headers.set("Cookie", cookieHeader);
    }

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

    await ensureBackendWarm(backendBaseUrl);

    const method = (fetchOptions.method ?? "GET").toUpperCase();
    const canRetry = method === "GET" || method === "HEAD";
    const maxAttempts = canRetry ? 2 : 1;

    let backendResponse: Response | undefined;
    let lastError: unknown;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      try {
        backendResponse = await fetch(backendUrl.toString(), {
          ...fetchOptions,
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });

        lastBackendSuccessAt = Date.now();
        break;
      } catch (error) {
        lastError = error;

        const hasAnotherAttempt = attempt < maxAttempts - 1;

        if (hasAnotherAttempt) {
          await new Promise((resolve) => setTimeout(resolve, 1_000));
        }
      }
    }

    if (!backendResponse) {
      throw lastError instanceof Error ? lastError : new Error("No se pudo conectar con el backend");
    }

    const data = backendResponse.status !== 204 ? await backendResponse.json().catch(() => null) : null;

    const response =
      backendResponse.status === 204
        ? new NextResponse(null, { status: 204 })
        : NextResponse.json(data, {
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

    const isTimeout = error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");

    return NextResponse.json(
      {
        success: false,
        message: isTimeout
          ? "El backend está iniciando. Inténtalo de nuevo en unos segundos."
          : error instanceof Error
            ? error.message
            : "Error de comunicación con el backend",
      },
      {
        status: isTimeout ? 503 : 500,
        headers: isTimeout
          ? {
              "Retry-After": "5",
            }
          : undefined,
      }
    );
  }
}
