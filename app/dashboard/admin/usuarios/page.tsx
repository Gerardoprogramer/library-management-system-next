"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { AdminMetric, AdminNav, AdminPage, AdminSection } from "@/components/admin/AdminTools";
import { useCurrentUser } from "@/hooks/queries/useCurrentUser";
import { adminService } from "@/services/adminService";
import { PiShieldCheck, PiUsersThree } from "react-icons/pi";

export default function AdminUsersPage() {
  const { data: user } = useCurrentUser();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<"all" | "admin" | "user">("all");
  const users = useQuery({
    queryKey: ["admin", "users"],
    queryFn: adminService.users,
    enabled: user?.isAdmin === true,
  });
  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return (users.data ?? []).filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        item.fullName.toLowerCase().includes(normalizedSearch) ||
        item.email.toLowerCase().includes(normalizedSearch);
      const matchesRole = role === "all" || (role === "admin" ? item.isAdmin : !item.isAdmin);
      return matchesSearch && matchesRole;
    });
  }, [role, search, users.data]);

  return (
    <AdminPage title="Usuarios" description="Consulta las cuentas registradas y sus permisos dentro de la biblioteca.">
      <AdminNav />
      <AdminMetric
        icon={PiUsersThree}
        label="Total de usuarios"
        value={users.isLoading ? "..." : (users.data?.length ?? 0)}
        detail="Personas con acceso a la biblioteca"
        tone="blue"
      />
      <AdminSection
        title="Directorio de usuarios"
        description={`${filteredUsers.length} resultados visibles.`}
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              aria-label="Buscar usuarios"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar nombre o correo"
              className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
            />
            <select
              aria-label="Filtrar por rol"
              value={role}
              onChange={(event) => setRole(event.target.value as typeof role)}
              className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
            >
              <option value="all">Todos los roles</option>
              <option value="admin">Administradores</option>
              <option value="user">Usuarios</option>
            </select>
          </div>
        }
      >
        {users.isLoading && <p className="px-5 py-8 text-sm text-muted-foreground">Cargando usuarios...</p>}
        {users.isError && (
          <p role="alert" className="px-5 py-8 text-sm text-destructive">
            No se pudo cargar el directorio de usuarios.
          </p>
        )}
        {!users.isLoading && !users.isError && !filteredUsers.length && (
          <p className="px-5 py-8 text-sm text-muted-foreground">No hay usuarios que coincidan con los filtros.</p>
        )}
        {!!filteredUsers.length && (
          <div className="overflow-x-auto">
            <div className="grid min-w-180 grid-cols-[1fr_1.2fr_1fr_auto] gap-4 border-b border-border/70 px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <span>Nombre</span>
              <span>Correo</span>
              <span>Último acceso</span>
              <span>Rol</span>
            </div>
            {filteredUsers.map((item) => (
              <div
                key={item.id}
                className="grid min-w-180 grid-cols-[1fr_1.2fr_1fr_auto] items-center gap-4 border-b border-border/60 px-5 py-4 text-sm last:border-0"
              >
                <span className="font-medium">{item.fullName}</span>
                <span className="text-muted-foreground">{item.email}</span>
                <span className="text-muted-foreground">
                  {item.lastLogin ? new Date(item.lastLogin).toLocaleString() : "Sin acceso registrado"}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                  <PiShieldCheck className={item.isAdmin ? "text-primary" : "text-muted-foreground"} />
                  {item.isAdmin ? "Administrador" : "Usuario"}
                </span>
              </div>
            ))}
          </div>
        )}
      </AdminSection>
    </AdminPage>
  );
}
