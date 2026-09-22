import { NextRequest } from "next/server";

import { backendProxy } from "@/lib/api-proxy";

export async function POST(request: NextRequest, { params }: { params: Promise<{ paymentId: string }> }) {
  const { paymentId } = await params;

  return backendProxy(request, `/admin/payments/${paymentId}/refund`);
}
