import { NextRequest } from "next/server";

import { backendProxy } from "@/lib/api-proxy";

export async function GET(request: NextRequest, { params }: { params: Promise<{ paymentId: string }> }) {
  const { paymentId } = await params;

  return backendProxy(request, `/payments/${paymentId}/status`);
}
