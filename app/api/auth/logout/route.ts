import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    try {
        const cookieStore = await cookies();
        const cookieHeader = cookieStore.toString();

        const backendResponse = await fetch(
            `${process.env.BACKEND_URL}/api/v1/auth/logout`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieHeader,
                },
            }
        );

        const data = await backendResponse.json();

        const response = NextResponse.json(data, {
            status: backendResponse.status,
        });

        const setCookie = backendResponse.headers.get("set-cookie");
        if (setCookie) {
            response.headers.set("set-cookie", setCookie);
        }

        return response;

    } catch (error) {
        return NextResponse.json(
            { message: "Error interno del servidor" },
            { status: 500 }
        );
    }
}