"use client";
import { useQuery } from "@tanstack/react-query";
import { genreService } from "@/services/genreService";
import { adminService } from "@/services/adminService";
import { AdminForm, AdminNav, AdminPage, AdminSection, Field } from "@/components/admin/AdminTools";
export default function AdminGenresPage() {
  const genres = useQuery({ queryKey: ["admin", "genres"], queryFn: genreService.genres });
  return <AdminPage title="Géneros" description="Administrá las categorías del catálogo.">
    <AdminNav />
    <div className="grid gap-6 lg:grid-cols-[minmax(280px,0.8fr)_1.2fr]">
      <AdminSection title="Nuevo género" description="Organiza el catálogo con categorías claras.">
        <AdminForm onSubmit={(v) => adminService.createGenre({ ...v, displayOrder: Number(v.displayOrder) })}>
          <Field name="code" label="Código" required /><Field name="name" label="Nombre" required />
          <Field name="description" label="Descripción" /><Field name="displayOrder" label="Orden" type="number" />
        </AdminForm>
      </AdminSection>
      <AdminSection title="Categorías existentes" description={`${genres.data?.length ?? 0} géneros registrados.`}>
        {genres.isLoading ? <p className="p-5 text-sm text-muted-foreground">Cargando...</p> : genres.data?.map((genre) => (
          <div key={genre.id} className="flex items-center justify-between border-b border-border/60 px-5 py-4 last:border-0">
            <div><p className="font-medium">{genre.name}</p><p className="mt-1 text-sm text-muted-foreground">{genre.code}</p></div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${genre.active ? "bg-emerald-500/12 text-emerald-600" : "bg-muted text-muted-foreground"}`}>{genre.active ? "Activo" : "Inactivo"}</span>
          </div>
        ))}
      </AdminSection>
    </div>
  </AdminPage>;
}
