import { NextRequest } from "next/server";
import { backendProxy } from "@/lib/api-proxy";

export async function POST(request: NextRequest) {

  try { await request.text(); } catch(e) {} 

  return backendProxy(request, "/auth/logout", { 
    method: "POST" 
  });
}