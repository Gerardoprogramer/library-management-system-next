"use client";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/adminService";
import { bookService } from "@/services/bookService";
import { AdminForm, AdminNav, AdminPage, Field } from "@/components/admin/AdminTools";

export default function AdminBooksPage() {
  const books = useQuery({ queryKey: ["admin", "books"], queryFn: () => bookService.search({ size: 50 }) });
  const save = (v: Record<string, string>) => {
    const payload = { ...v, pages: Number(v.pages), totalCopies: Number(v.totalCopies), price: Number(v.price) };
    if (v.bulkJson) return adminService.bulkCreateBooks(JSON.parse(v.bulkJson));
    return v.id ? adminService.updateBook(v.id, payload) : adminService.createBook(payload);
  };
  return <AdminPage title="Libros" description="Alta, edición, baja y carga masiva del catálogo."><AdminNav /><div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]"><AdminForm onSubmit={save}><div className="grid gap-3 sm:grid-cols-2"><Field name="id" label="ID (para editar)" /><Field name="isbn" label="ISBN" required /><Field name="title" label="Título" required /><Field name="author" label="Autor" required /><Field name="genreId" label="ID de género" required /><Field name="publisher" label="Editorial" /><Field name="publishedDate" label="Fecha de publicación" type="date" /><Field name="pages" label="Páginas" type="number" /><Field name="totalCopies" label="Copias" type="number" /><Field name="description" label="Descripción" /><Field name="bulkJson" label="Carga masiva (JSON)" /></div></AdminForm><section className="overflow-hidden rounded-2xl border border-border/70 bg-card"><div className="border-b border-border/70 px-5 py-4 font-semibold">Catálogo actual</div>{books.isLoading ? <p className="p-5 text-sm text-muted-foreground">Cargando...</p> : books.data?.content.map((book) => <div key={book.id} className="flex items-center justify-between border-b border-border/60 px-5 py-4 text-sm last:border-0"><div><p className="font-medium">{book.title}</p><p className="text-muted-foreground">{book.author} · {book.genreName}</p></div><span className="text-muted-foreground">{book.availableCopies} disponibles</span></div>)}</section></div></AdminPage>;
}
