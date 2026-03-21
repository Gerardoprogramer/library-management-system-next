import { NextRequest } from "next/server";
import { backendProxy } from "@/lib/api-proxy";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  const { bookId } = await params;

  return backendProxy(request, `/wishlist/${bookId}`, { method: "POST" });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  const { bookId } = await params;
  return backendProxy(request, `/wishlist/${bookId}`, { method: "DELETE" });
}