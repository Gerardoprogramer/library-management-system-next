"use client";

import { useQuery } from "@tanstack/react-query";
import { PiChartBar, PiUsersThree } from "react-icons/pi";

import { useCurrentUser } from "@/hooks/queries/useCurrentUser";
import { adminService } from "@/services/adminService";
import { bookService } from "@/services/bookService";

export default function AdminPage() {
  const { data: user } = useCurrentUser();
  const users = useQuery({
    queryKey: ["admin", "users"],
    queryFn: adminService.users,
    enabled: user?.isAdmin === true,
  });
  const stats = useQuery({
    queryKey: ["admin", "book-stats"],
    queryFn: bookService.stats,
    enabled: user?.isAdmin === true,
  });

  return (
    <div className="space-y-8">
      <section>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Administración</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">Panel administrativo</h2>
        <p className="mt-2 text-sm text-muted-foreground">Resumen operativo de la biblioteca.</p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-border/70 bg-card p-5">
          <PiUsersThree className="size-5 text-primary" />
          <p className="mt-5 text-sm text-muted-foreground">Usuarios registrados</p>
          <p className="mt-1 text-3xl font-semibold">{users.isLoading ? "..." : (users.data?.length ?? 0)}</p>
        </article>
        <article className="rounded-2xl border border-border/70 bg-card p-5">
          <PiChartBar className="size-5 text-primary" />
          <p className="mt-5 text-sm text-muted-foreground">Libros activos</p>
          <p className="mt-1 text-3xl font-semibold">{stats.isLoading ? "..." : (stats.data?.totalActiveBooks ?? 0)}</p>
        </article>
      </div>
    </div>
  );
}
