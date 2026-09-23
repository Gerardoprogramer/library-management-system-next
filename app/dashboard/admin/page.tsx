"use client";

import { useQuery } from "@tanstack/react-query";
import { PiBookOpenText, PiChartBar, PiUsersThree } from "react-icons/pi";

import { useCurrentUser } from "@/hooks/queries/useCurrentUser";
import { adminService } from "@/services/adminService";
import { bookService } from "@/services/bookService";
import { AdminMetric, AdminNav, AdminPage, AdminSection } from "@/components/admin/AdminTools";

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

      <div className="grid gap-4 md:grid-cols-3">
        <AdminMetric
          icon={PiUsersThree}
          label="Usuarios registrados"
          value={users.isLoading ? "..." : (users.data?.length ?? 0)}
          detail="Cuentas activas en la plataforma"
          tone="blue"
        />
        <AdminMetric
          icon={PiBookOpenText}
          label="Libros activos"
          value={stats.isLoading ? "..." : (stats.data?.totalActiveBooks ?? 0)}
          detail="Títulos disponibles en el catálogo"
        />
        <AdminMetric
          icon={PiChartBar}
          label="Disponibilidad"
          value={stats.isLoading ? "..." : (stats.data?.totalAvailableBooks ?? 0)}
          detail="Ejemplares listos para préstamo"
          tone="green"
        />
      </div>

      <AdminSection title="Resumen operativo" description="Accede rápidamente a las áreas que requieren atención.">
        <div className="grid gap-px bg-border/60 sm:grid-cols-3">
          {[
            ["Catálogo", "Gestiona títulos, copias y disponibilidad.", "/dashboard/admin/libros"],
            ["Operaciones", "Revisa préstamos y reservas recientes.", "/dashboard/admin/operaciones"],
            ["Pagos", "Consulta cobros, multas y reembolsos.", "/dashboard/admin/pagos"],
          ].map(([title, description, href]) => (
            <a key={href} href={href} className="bg-card p-5 transition hover:bg-muted/45">
              <p className="font-medium">{title}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
              <span className="mt-4 inline-block text-sm font-medium text-primary">Abrir sección →</span>
            </a>
          ))}
        </div>
      </AdminSection>
    </AdminPage>
  );
}
