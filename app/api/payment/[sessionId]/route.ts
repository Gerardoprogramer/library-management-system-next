import { NextRequest } from "next/server";
import { backendProxy } from "@/lib/api-proxy";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    const { sessionId } = await params;
    console.log("Received session ID:", sessionId);
    return backendProxy(request, `/payments/success-details/${sessionId}`);
}