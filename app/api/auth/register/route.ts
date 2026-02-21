import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Llamada al backend
    const backendResponse = await fetch(
      `${process.env.BACKEND_URL}/api/v1/auth/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    // Obtener datos
    const data = await backendResponse.json();

    // Crear respuesta hacia el cliente
    const response = NextResponse.json(data, {
      status: backendResponse.status,
    });

    // Copiar cookies del backend (JWT HttpOnly)
    const setCookieHeader = backendResponse.headers.get("set-cookie");

    if (setCookieHeader) {
      response.headers.set("set-cookie", setCookieHeader);
    }

    return response;

  } catch (error) {
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}