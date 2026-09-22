"use client";

import { useQuery } from "@tanstack/react-query";

import { useCurrentUser } from "@/hooks/queries/useCurrentUser";
import { bookService } from "@/services/bookService";
import { AdminMetric, AdminNav, AdminPage, AdminSection } from "@/components/admin/AdminTools";
import { PiBookOpenText, PiCheckCircle } from "react-icons/pi";

export default function AdminStatsPage() {
  const { data: user } = useCurrentUser();
  const stats = useQuery({
    queryKey: ["admin", "book-stats"],
    queryFn: bookService.stats,
    enabled: user?.isAdmin === true,
  });

  return (
    <AdminPage title="Estadísticas" description="Indicadores principales del catálogo y su disponibilidad.">
      <AdminNav />
      <div className="grid gap-4 sm:grid-cols-2">
        <AdminMetric icon={PiBookOpenText} label="Libros activos" value={stats.isLoading ? "..." : stats.data?.totalActiveBooks ?? 0} detail="Títulos publicados en el catálogo" />
        <AdminMetric icon={PiCheckCircle} label="Libros disponibles" value={stats.isLoading ? "..." : stats.data?.totalAvailableBooks ?? 0} detail="Ejemplares con disponibilidad" tone="green" />
      </div>
      <AdminSection title="Lectura del catálogo" description="Indicadores para conocer el estado general de tu inventario.">
        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <div className="rounded-2xl bg-muted/45 p-5">
            <p className="text-sm text-muted-foreground">Tasa de disponibilidad</p>
            <p className="mt-2 text-3xl font-semibold">
              {stats.isLoading || !stats.data?.totalActiveBooks
                ? "..."
                : `${Math.round((stats.data.totalAvailableBooks / stats.data.totalActiveBooks) * 100)}%`}
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-border">
              <div className="h-full rounded-full bg-primary" style={{ width: `${stats.data?.totalActiveBooks ? Math.min(100, (stats.data.totalAvailableBooks / stats.data.totalActiveBooks) * 100) : 0}%` }} />
            </div>
          </div>
          <div className="rounded-2xl border border-border/70 p-5">
            <p className="text-sm text-muted-foreground">Siguiente acción recomendada</p>
            <p className="mt-2 font-semibold">Revisar títulos con pocas copias</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Mantén el catálogo equilibrado para que los usuarios encuentren ejemplares disponibles.</p>
          </div>
        </div>
      </AdminSection>
    </AdminPage>
  );
}
