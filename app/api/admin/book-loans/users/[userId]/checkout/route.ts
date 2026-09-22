import { NextRequest } from "next/server";

import { backendProxy } from "@/lib/api-proxy";

export async function POST(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  return backendProxy(request, `/admin/book-loans/users/${userId}/checkout`);
}
