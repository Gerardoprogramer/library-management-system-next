import { NextRequest } from "next/server";

import { backendProxy } from "@/lib/api-proxy";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return backendProxy(request, `/admin/genres/${id}`);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return backendProxy(request, `/admin/genres/${id}`);
}
