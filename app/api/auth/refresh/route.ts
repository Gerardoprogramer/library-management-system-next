import { NextRequest } from "next/server";
import { backendProxy } from "@/lib/api-proxy";

export async function POST(request: NextRequest) {

  return backendProxy(request, "/auth/refresh", {
    method: "POST"
  });
}