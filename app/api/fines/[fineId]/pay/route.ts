import { NextRequest } from "next/server";

import { backendProxy } from "@/lib/api-proxy";

export async function POST(request: NextRequest, { params }: { params: Promise<{ fineId: string }> }) {
  const { fineId } = await params;

  return backendProxy(request, `/fines/${fineId}/pay`);
}
