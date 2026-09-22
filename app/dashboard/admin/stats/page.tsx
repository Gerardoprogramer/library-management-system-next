"use client";

import { useQuery } from "@tanstack/react-query";

import { useCurrentUser } from "@/hooks/queries/useCurrentUser";
import { bookService } from "@/services/bookService";

export default function AdminStatsPage() {
  const { data: user } = useCurrentUser();
  const stats = useQuery({
    queryKey: ["admin", "book-stats"],
    queryFn: bookService.stats,
    enabled: user?.isAdmin === true,
  });

  return (
    <div className="space-y-8">
      <section>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Administración</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">Estadísticas</h2>
      </section>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-card p-5">
          <p className="text-sm text-muted-foreground">Libros activos</p>
          <p className="mt-2 text-3xl font-semibold">{stats.isLoading ? "..." : (stats.data?.totalActiveBooks ?? 0)}</p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-card p-5">
          <p className="text-sm text-muted-foreground">Libros disponibles</p>
          <p className="mt-2 text-3xl font-semibold">
            {stats.isLoading ? "..." : (stats.data?.totalAvailableBooks ?? 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
