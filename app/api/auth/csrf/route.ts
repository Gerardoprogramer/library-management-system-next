import { NextRequest } from "next/server";
import { backendProxy } from "@/lib/api-proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return backendProxy(request, "/auth/csrf", {
    method: "GET",
  });
}
