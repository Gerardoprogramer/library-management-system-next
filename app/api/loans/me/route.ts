import { NextRequest, NextResponse } from "next/server";
import type { meLoans, ApiResponse, PageResponse } from "@/lib/definitions";

export async function GET(request: NextRequest) {
  try {
    const cookie = request.headers.get("cookie");

    const { searchParams } = new URL(request.url);

    const backendUrl = new URL(
      `${process.env.BACKEND_URL}/api/v1/book-loans/me`
    );

    searchParams.forEach((value, key) => {
      backendUrl.searchParams.append(key, value);
    });

    const backendResponse = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        cookie: cookie || "",
      },
      cache: "no-store",
    });

    const data: ApiResponse<PageResponse<meLoans>> =
      await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(data, {
        status: backendResponse.status,
      });
    }

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
      {
        success: false,
        message: "Error interno del servidor",
        data: null,
      },
      { status: 500 }
    );
  }
}