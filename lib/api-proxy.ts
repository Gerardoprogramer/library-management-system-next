import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function backendProxy(
  request: NextRequest,
  endpoint: string,
  options: { method?: string; body?: any } = {}
) {
  try {
    // 1. Obtener cookies de forma nativa (lo que te funcionó)
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    
    // 2. Construir URL
    const { searchParams } = new URL(request.url);
    const backendUrl = new URL(`${process.env.BACKEND_URL}/api/v1${endpoint}`);
    searchParams.forEach((v, k) => backendUrl.searchParams.append(k, v));

    // 3. Preparar opciones de Fetch
    const fetchOptions: RequestInit = {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookieHeader,
      },
      cache: "no-store",
    };

    // 4. Solo incluir el body si existe y tiene contenido
    if (options.body && Object.keys(options.body).length > 0) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    // 5. EJECUCIÓN DEL FETCH
    const backendResponse = await fetch(backendUrl.toString(), fetchOptions);

    // 6. Procesar respuesta
    const data = backendResponse.status !== 204 
      ? await backendResponse.json().catch(() => null) 
      : null;

    const response = NextResponse.json(data, { status: backendResponse.status });

    // 7. Propagar Cookies de vuelta al cliente
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