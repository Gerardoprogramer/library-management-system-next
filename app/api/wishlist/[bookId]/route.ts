import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
 
    const cookie = request.headers.get("cookie");


    const segments = request.nextUrl.pathname.split("/");
    const bookId = segments[segments.length - 1];

    if (!bookId) {
      return NextResponse.json(
        { success: false, message: "bookId es requerido", data: null },
        { status: 400 }
      );
    }

    const notes = request.nextUrl.searchParams.get("notes") || null;

    const backendUrl = new URL(
      `${process.env.BACKEND_URL}/api/v1/wishlist/${bookId}`
    );
    if (notes) backendUrl.searchParams.append("notes", notes);


    const backendResponse = await fetch(backendUrl.toString(), {
      method: "POST",
      headers: {
        cookie: cookie || "",
      },
      cache: "no-store",
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(errorData, {
        status: backendResponse.status,
      });
    }

    return new NextResponse(null, { status: backendResponse.status });
  } catch (error) {
    console.error("Error en wishlist route:", error);
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

export async function DELETE(request: NextRequest) {
  try {

    const cookie = request.headers.get("cookie");


    const segments = request.nextUrl.pathname.split("/");
    const bookId = segments[segments.length - 1];

    if (!bookId) {
      return NextResponse.json(
        { success: false, message: "bookId es requerido", data: null },
        { status: 400 }
      );
    }


    const backendUrl = new URL(
      `${process.env.BACKEND_URL}/api/v1/wishlist/${bookId}`
    );
    
    const backendResponse = await fetch(backendUrl.toString(), {
      method: "DELETE",
      headers: {
        cookie: cookie || "",
      },
      cache: "no-store",
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(errorData, {
        status: backendResponse.status,
      });
    }

    return new NextResponse(null, { status: backendResponse.status });
  } catch (error) {
    console.error("Error en wishlist route:", error);
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