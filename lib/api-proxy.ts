import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function backendProxy(
  request: NextRequest,
  endpoint: string,
  options: { method?: string; body?: any } = {}
) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const { searchParams } = new URL(request.url);
    const backendUrl = new URL(`${process.env.BACKEND_URL}/api/v1${endpoint}`);
    searchParams.forEach((v, k) => backendUrl.searchParams.append(k, v));

    const fetchOptions: RequestInit = {
      method: options.method || request.method,
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookieHeader,
      },
      cache: "no-store",
    };

    if (options.body) {
      fetchOptions.body = JSON.stringify(options.body);
    } else if (request.method !== "GET" && request.method !== "HEAD") {
      const body = await request.json().catch(() => null);
      if (body) fetchOptions.body = JSON.stringify(body);
    }

    const backendResponse = await fetch(backendUrl.toString(), fetchOptions);

    const data = backendResponse.status !== 204
      ? await backendResponse.json().catch(() => null)
      : null;

    const response = NextResponse.json(data, { status: backendResponse.status });

    const setCookie = backendResponse.headers.get("set-cookie");
    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }

    return response;
  } catch (error) {
    console.error(`[Proxy Error] ${endpoint}:`, error);
    return NextResponse.json(
      { success: false, message: "Error de comunicación" },
      { status: 500 }
    );
  }
}