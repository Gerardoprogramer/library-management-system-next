import { NextRequest } from "next/server";
import { backendProxy } from "@/lib/api-proxy";

export async function POST(request: NextRequest) {
  // Opcional: Esto consume el stream del request para cerrarlo limpiamente en Next 16
  // aunque el logout no lleve body, previene conflictos de red.
  try { await request.text(); } catch(e) {} 

  return backendProxy(request, "/auth/logout", { 
    method: "POST" 
    // NOTA: NO mandamos 'body: {}', lo dejamos vacío para que el proxy 
    // no genere la propiedad 'body' en el fetch, tal cual tu versión manual.
  });
}