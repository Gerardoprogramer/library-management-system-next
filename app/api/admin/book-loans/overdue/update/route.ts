import { NextRequest } from "next/server";

import { backendProxy } from "@/lib/api-proxy";

export async function PUT(request: NextRequest) {
  return backendProxy(request, "/admin/book-loans/overdue/update");
}
