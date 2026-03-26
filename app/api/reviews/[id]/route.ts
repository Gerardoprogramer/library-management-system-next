import { NextRequest } from "next/server";
import { backendProxy } from "@/lib/api-proxy";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  //id --> bookId
  return backendProxy(request, `/reviews/book/${id}`);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  //id --> reviewId
  return backendProxy(request, `/reviews/${id}`);
}