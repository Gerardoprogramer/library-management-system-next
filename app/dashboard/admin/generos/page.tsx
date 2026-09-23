"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { AdminNav, AdminPage, AdminSection, Field } from "@/components/admin/AdminTools";
import { AdminActionDialog } from "@/components/admin/AdminActionDialog";
import { adminService } from "@/services/adminService";
import { genreService } from "@/services/genreService";
import type { AdminGenreInput, Genre } from "@/lib/definitions";

const emptyForm: AdminGenreInput = { code: "", name: "", description: "", displayOrder: 0, parentGenreId: null };

export default function AdminGenresPage() {
  const queryClient = useQueryClient();
  const genres = useQuery({ queryKey: ["admin", "genres"], queryFn: genreService.genres });
  const [editing, setEditing] = useState<Genre | null>(null);
  const [form, setForm] = useState<AdminGenreInput>(emptyForm);
  const [deactivatingGenre, setDeactivatingGenre] = useState<Genre | null>(null);
  const mutation = useMutation({
    mutationFn: () => (editing ? adminService.updateGenre(editing.id, form) : adminService.createGenre(form)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "genres"] });
      setEditing(null);
      setForm(emptyForm);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: ({ id, hard }: { id: string; hard: boolean }) => adminService.deleteGenre(id, hard),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "genres"] }),
  });

  const startEditing = (genre: Genre) => {
    setEditing(genre);
    setForm({
      code: genre.code,
      name: genre.name,
      description: genre.description ?? "",
      displayOrder: genre.displayOrder,
      active: genre.active,
      parentGenreId: genre.parentGenreId,
    });
  };

  const update = (name: string, value: string) => {
    if (!(name in form)) return;
    const key = name as keyof AdminGenreInput;
    setForm((current) => ({
      ...current,
      [key]: key === "displayOrder" ? Number(value) : value,
    }));
  };

  return (
    <AdminPage title="Géneros" description="Organiza el catálogo con categorías claras y fáciles de mantener.">
      <AdminNav />
      <AdminActionDialog
        open={Boolean(deactivatingGenre)}
        onOpenChange={(open) => !open && setDeactivatingGenre(null)}
        title="Desactivar género"
        description={`¿Quieres desactivar ${deactivatingGenre?.name ?? "este género"}?`}
        confirmLabel="Desactivar"
        onConfirm={() => {
          if (deactivatingGenre) deleteMutation.mutate({ id: deactivatingGenre.id, hard: false });
          setDeactivatingGenre(null);
        }}
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(300px,0.8fr)_1.2fr]">
        <AdminSection
          title={editing ? "Editar género" : "Nuevo género"}
          description={
            editing ? "Actualiza la información y el estado de la categoría." : "Añade una categoría al catálogo."
          }
          action={
            editing ? (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setForm(emptyForm);
                }}
                className="text-sm font-medium text-primary"
              >
                Cancelar
              </button>
            ) : undefined
          }
        >
          <form
            className="space-y-4 p-5 sm:p-6"
            onSubmit={(event) => {
              event.preventDefault();
              mutation.mutate();
            }}
          >
            <Field name="code" label="Código" required value={form.code} onChange={update} />
            <Field name="name" label="Nombre" required value={form.name} onChange={update} />
            <Field name="description" label="Descripción" value={form.description ?? ""} onChange={update} />
            <Field
              name="displayOrder"
              label="Orden de visualización"
              type="number"
              value={String(form.displayOrder ?? 0)}
              onChange={update}
            />
            <label className="block space-y-2 text-sm">
              <span className="font-medium">Género padre</span>
              <select
                value={form.parentGenreId ?? ""}
                onChange={(event) => update("parentGenreId", event.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-background/70 px-3"
              >
                <option value="">Sin género padre</option>
                {genres.data
                  ?.filter((genre) => genre.id !== editing?.id)
                  .map((genre) => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
              </select>
            </label>
            {mutation.isError && (
              <p role="alert" className="text-sm text-destructive">
                {(mutation.error as Error).message}
              </p>
            )}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {mutation.isPending ? "Guardando..." : editing ? "Guardar cambios" : "Crear género"}
            </button>
          </form>
        </AdminSection>
        <AdminSection title="Categorías existentes" description={`${genres.data?.length ?? 0} géneros registrados.`}>
          {genres.isLoading && <p className="p-5 text-sm text-muted-foreground">Cargando géneros...</p>}
          {genres.isError && (
            <p role="alert" className="p-5 text-sm text-destructive">
              No se pudieron cargar los géneros.
            </p>
          )}
          {!genres.isLoading && !genres.data?.length && (
            <p className="p-5 text-sm text-muted-foreground">Todavía no hay géneros registrados.</p>
          )}
          {genres.data?.map((genre) => (
            <div
              key={genre.id}
              className="flex flex-col gap-3 border-b border-border/60 px-5 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{genre.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {genre.code}
                  {genre.parentGenreId ? " · Subcategoría" : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${genre.active ? "bg-emerald-500/12 text-emerald-600" : "bg-muted text-muted-foreground"}`}
                >
                  {genre.active ? "Activo" : "Inactivo"}
                </span>
                <button
                  type="button"
                  onClick={() => startEditing(genre)}
                  className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeactivatingGenre(genre);
                  }}
                  className="rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
                >
                  Desactivar
                </button>
              </div>
            </div>
          ))}
        </AdminSection>
      </div>
    </AdminPage>
  );
}
