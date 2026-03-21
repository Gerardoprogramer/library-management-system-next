import { NextRequest } from "next/server";
import { backendProxy } from "@/lib/api-proxy";

export async function POST(request: NextRequest) {
  const body = await request.json();

  return backendProxy(request, "/auth/signup", {
    method: "POST",
    body: body
  });
}