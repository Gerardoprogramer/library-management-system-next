import { NextRequest, NextResponse } from "next/server";
import { ApiResponse, type Genre } from "@/lib/definitions";

export async function GET(request: NextRequest) {
  try {
    const cookie = request.headers.get("cookie");

    const backendResponse = await fetch(
      `${process.env.BACKEND_URL}/api/v1/genres`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          cookie: cookie || "",
        },
      }
    );

    const data: ApiResponse<Genre[]> = await backendResponse.json();

    const response = NextResponse.json(data, {
      status: backendResponse.status,
    });

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