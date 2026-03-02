import type { PageResponse, ApiResponse, Review } from "@/lib/definitions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ bookId: string }> }
) {
    const { bookId } = await context.params;

    try {
        const cookie = request.headers.get("cookie");

        const backendResponse = await fetch(
            `${process.env.BACKEND_URL}/api/v1/reviews/book/${bookId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    cookie: cookie || "",
                },
                cache: "no-store",
            }
        );

        const data: ApiResponse<PageResponse<Review>> = await backendResponse.json();
        
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