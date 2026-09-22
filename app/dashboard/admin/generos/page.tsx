"use client";
import { useQuery } from "@tanstack/react-query";
import { genreService } from "@/services/genreService";
import { adminService } from "@/services/adminService";
import { AdminForm, AdminNav, AdminPage, Field } from "@/components/admin/AdminTools";
export default function AdminGenresPage() {
  const genres = useQuery({ queryKey: ["admin", "genres"], queryFn: genreService.genres });
  return <AdminPage title="Géneros" description="Administrá las categorías del catálogo."><AdminNav /><div className="grid gap-6 lg:grid-cols-2"><AdminForm onSubmit={(v) => adminService.createGenre({ ...v, displayOrder: Number(v.displayOrder) })}><Field name="code" label="Código" required /><Field name="name" label="Nombre" required /><Field name="description" label="Descripción" /><Field name="displayOrder" label="Orden" type="number" /></AdminForm><section className="rounded-2xl border border-border/70 bg-card">{genres.isLoading ? <p className="p-5 text-sm text-muted-foreground">Cargando...</p> : genres.data?.map((genre) => <div key={genre.id} className="border-b border-border/60 px-5 py-4 last:border-0"><p className="font-medium">{genre.name}</p><p className="text-sm text-muted-foreground">{genre.code} · {genre.active ? "Activo" : "Inactivo"}</p></div>)}</section></div></AdminPage>;
}
