"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { AdminNav, AdminPage, AdminSection, Field } from "@/components/admin/AdminTools";
import type { AdminBookInput, BookSummary, Genre } from "@/lib/definitions";
import { adminService } from "@/services/adminService";
import { bookService } from "@/services/bookService";
import { genreService } from "@/services/genreService";

const emptyForm: AdminBookInput = {
  isbn: "",
  title: "",
  author: "",
  genreId: "",
  publisher: "",
  pages: 1,
  totalCopies: 1,
  price: 0,
  description: "",
};

export default function AdminBooksPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [editing, setEditing] = useState<BookSummary | null>(null);
  const [form, setForm] = useState<AdminBookInput>(emptyForm);
  const books = useQuery({
    queryKey: ["admin", "books", searchTerm],
    queryFn: () => bookService.search({ size: 50, searchTerm }),
  });
  const genres = useQuery<Genre[]>({ queryKey: ["admin", "genres"], queryFn: genreService.genres });
  const mutation = useMutation({
    mutationFn: () => (editing ? adminService.updateBook(editing.id, form) : adminService.createBook(form)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "books"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
      setEditing(null);
      setForm(emptyForm);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: ({ id, hard }: { id: string; hard: boolean }) => adminService.deleteBook(id, hard),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "books"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  const update = (name: string, value: string) => {
    if (!(name in form)) return;
    const key = name as keyof AdminBookInput;
    setForm((current) => ({
      ...current,
      [key]: ["pages", "totalCopies", "availableCopies", "price"].includes(key) ? Number(value) : value,
    }));
  };
  const startEditing = (book: BookSummary) => {
    setEditing(book);
    setForm({
      title: book.title,
      author: book.author,
      genreId: genres.data?.find((genre) => genre.name === book.genreName)?.id ?? "",
      pages: book.pages,
      totalCopies: book.availableCopies,
      availableCopies: book.availableCopies,
    });
  };

  return (
    <AdminPage title="Libros" description="Gestiona el catálogo, sus existencias y el estado de cada título.">
      <AdminNav />
      <div className="grid gap-6 lg:grid-cols-[minmax(340px,0.9fr)_1.1fr]">
        <AdminSection
          title={editing ? "Editar libro" : "Añadir libro"}
          description={
            editing ? "Actualiza los datos visibles del catálogo." : "Completa los datos básicos del nuevo título."
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
            {!editing && <Field name="isbn" label="ISBN" required value={form.isbn ?? ""} onChange={update} />}
            <Field name="title" label="Título" required value={form.title ?? ""} onChange={update} />
            <Field name="author" label="Autor" required value={form.author ?? ""} onChange={update} />
            <label className="block space-y-2 text-sm">
              <span className="font-medium">
                Género<span className="ml-1 text-primary">*</span>
              </span>
              <select
                required
                value={form.genreId ?? ""}
                onChange={(event) => update("genreId", event.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-background/70 px-3"
              >
                <option value="">Selecciona un género</option>
                {genres.data
                  ?.filter((genre) => genre.active)
                  .map((genre) => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                name="pages"
                label="Páginas"
                type="number"
                required
                value={String(form.pages ?? 1)}
                onChange={update}
              />
              <Field
                name="totalCopies"
                label="Copias totales"
                type="number"
                required
                value={String(form.totalCopies ?? 1)}
                onChange={update}
              />
            </div>
            <Field name="publisher" label="Editorial" value={form.publisher ?? ""} onChange={update} />
            <Field
              name="publishedDate"
              label="Fecha de publicación"
              type="date"
              value={form.publishedDate ?? ""}
              onChange={update}
            />
            <Field name="coverImageUrl" label="URL de portada" value={form.coverImageUrl ?? ""} onChange={update} />
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
              {mutation.isPending ? "Guardando..." : editing ? "Guardar cambios" : "Crear libro"}
            </button>
          </form>
        </AdminSection>
        <AdminSection
          title="Catálogo actual"
          description={`${books.data?.totalElements ?? 0} libros registrados.`}
          action={
            <input
              aria-label="Buscar libros"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar..."
              className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
            />
          }
        >
          {books.isLoading && <p className="p-5 text-sm text-muted-foreground">Cargando catálogo...</p>}
          {books.isError && (
            <p role="alert" className="p-5 text-sm text-destructive">
              No se pudo cargar el catálogo.
            </p>
          )}
          {!books.isLoading && !books.data?.content.length && (
            <p className="p-5 text-sm text-muted-foreground">No hay libros que coincidan con la búsqueda.</p>
          )}
          {books.data?.content.map((book) => (
            <div
              key={book.id}
              className="flex flex-col gap-3 border-b border-border/60 px-5 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{book.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {book.author} · {book.genreName}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="whitespace-nowrap rounded-full bg-emerald-500/12 px-2.5 py-1 text-xs font-medium text-emerald-600">
                  {book.availableCopies} disponibles
                </span>
                <button
                  type="button"
                  onClick={() => startEditing(book)}
                  className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`¿Desactivar ${book.title}?`))
                      deleteMutation.mutate({ id: book.id, hard: false });
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
