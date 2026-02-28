import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  console.log("ID:", id);

  try {
    const cookie = request.headers.get("cookie");

    const backendResponse = await fetch(
      `${process.env.BACKEND_URL}/api/v1/books/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          cookie: cookie || "",
        },
        cache: "no-store",
      }
    );

    const data = await backendResponse.json();

    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}