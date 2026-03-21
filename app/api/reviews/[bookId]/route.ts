import { NextRequest } from "next/server";
import { backendProxy } from "@/lib/api-proxy";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  const { bookId } = await params;

  return backendProxy(request, `/reviews/book/${bookId}`);
}