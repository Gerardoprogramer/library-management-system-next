import { NextRequest } from "next/server";
import { backendProxy } from "@/lib/api-proxy";

export async function GET(request: NextRequest) {

  return backendProxy(request, "/subscriptions/active");
}

export async function POST(request: NextRequest) {

  return backendProxy(request, "/subscriptions");
}