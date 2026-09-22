"use client";

import { useQuery } from "@tanstack/react-query";
import { PiChartBar, PiUsersThree } from "react-icons/pi";

import { useCurrentUser } from "@/hooks/queries/useCurrentUser";
import { adminService } from "@/services/adminService";
import { bookService } from "@/services/bookService";
import { AdminNav, AdminPage } from "@/components/admin/AdminTools";

export default function AdminDashboardPage() {
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
    <AdminPage title="Panel administrativo" description="Una vista rápida del estado actual de tu biblioteca.">
      <AdminNav />

      <div className="grid gap-4 sm:grid-cols-2">
        <article className="surface p-5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary"><PiUsersThree className="size-5" /></div>
          <p className="mt-5 text-sm text-muted-foreground">Usuarios registrados</p>
          <p className="mt-1 text-3xl font-semibold">{users.isLoading ? "..." : (users.data?.length ?? 0)}</p>
        </article>
        <article className="surface p-5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary"><PiChartBar className="size-5" /></div>
          <p className="mt-5 text-sm text-muted-foreground">Libros activos</p>
          <p className="mt-1 text-3xl font-semibold">{stats.isLoading ? "..." : (stats.data?.totalActiveBooks ?? 0)}</p>
        </article>
      </div>
    </AdminPage>
  );
}
