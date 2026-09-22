"use client";

import { useQuery } from "@tanstack/react-query";

import { useCurrentUser } from "@/hooks/queries/useCurrentUser";
import { adminService } from "@/services/adminService";
import { AdminNav, AdminPage } from "@/components/admin/AdminTools";

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

      <div className="surface overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_auto] gap-4 border-b border-border/70 px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <span>Nombre</span>
          <span>Correo</span>
          <span>Rol</span>
        </div>
        {users.isLoading ? (
          <p className="px-5 py-8 text-sm text-muted-foreground">Cargando usuarios...</p>
        ) : users.data?.length ? (
          users.data.map((item) => (
            <div key={item.id} className="grid grid-cols-[1fr_1fr_auto] gap-4 border-b border-border/60 px-5 py-4 text-sm last:border-0">
              <span className="font-medium">{item.fullName}</span>
              <span className="text-muted-foreground">{item.email}</span>
              <span>{item.isAdmin ? "Administrador" : "Usuario"}</span>
            </div>
          ))
        ) : (
          <p className="px-5 py-8 text-sm text-muted-foreground">No hay usuarios disponibles.</p>
        )}
      </div>
    </AdminPage>
  );
}
