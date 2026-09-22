"use client";

import { useQuery } from "@tanstack/react-query";

import { useCurrentUser } from "@/hooks/queries/useCurrentUser";
import { bookService } from "@/services/bookService";
import { AdminNav, AdminPage } from "@/components/admin/AdminTools";

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
        <div className="surface p-5">
          <p className="text-sm text-muted-foreground">Libros activos</p>
          <p className="mt-2 text-3xl font-semibold">{stats.isLoading ? "..." : (stats.data?.totalActiveBooks ?? 0)}</p>
        </div>
        <div className="surface p-5">
          <p className="text-sm text-muted-foreground">Libros disponibles</p>
          <p className="mt-2 text-3xl font-semibold">
            {stats.isLoading ? "..." : (stats.data?.totalAvailableBooks ?? 0)}
          </p>
        </div>
      </div>
    </AdminPage>
  );
}
