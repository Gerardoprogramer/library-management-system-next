"use client";

import { useQuery } from "@tanstack/react-query";

import { useCurrentUser } from "@/hooks/queries/useCurrentUser";
import { adminService } from "@/services/adminService";
import { AdminMetric, AdminNav, AdminPage, AdminSection } from "@/components/admin/AdminTools";
import { PiShieldCheck, PiUsersThree } from "react-icons/pi";

export default function AdminUsersPage() {
  const { data: user } = useCurrentUser();
  const users = useQuery({
    queryKey: ["admin", "users"],
    queryFn: adminService.users,
    enabled: user?.isAdmin === true,
  });

  return (
    <AdminPage title="Usuarios" description="Consulta las cuentas registradas y sus permisos dentro de la biblioteca.">
      <AdminNav />

      <AdminMetric icon={PiUsersThree} label="Total de usuarios" value={users.isLoading ? "..." : users.data?.length ?? 0} detail="Personas con acceso a la biblioteca" tone="blue" />

      <AdminSection title="Directorio de usuarios" description="Consulta las cuentas registradas y sus permisos dentro de la biblioteca.">
      <div className="overflow-x-auto">
        <div className="grid grid-cols-[1fr_1fr_auto] gap-4 border-b border-border/70 px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <span>Nombre</span>
          <span>Correo</span>
          <span>Rol</span>
        </div>
        {users.isLoading ? (
          <p className="px-5 py-8 text-sm text-muted-foreground">Cargando usuarios...</p>
        ) : users.data?.length ? (
          users.data.map((item) => (
            <div key={item.id} className="grid min-w-160 grid-cols-[1fr_1fr_auto] items-center gap-4 border-b border-border/60 px-5 py-4 text-sm last:border-0">
              <span className="font-medium">{item.fullName}</span>
              <span className="text-muted-foreground">{item.email}</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium"><PiShieldCheck className={item.isAdmin ? "text-primary" : "text-muted-foreground"} />{item.isAdmin ? "Administrador" : "Usuario"}</span>
            </div>
          ))
        ) : (
          <p className="px-5 py-8 text-sm text-muted-foreground">No hay usuarios disponibles.</p>
        )}
      </div>
      </AdminSection>
    </AdminPage>
  );
}
