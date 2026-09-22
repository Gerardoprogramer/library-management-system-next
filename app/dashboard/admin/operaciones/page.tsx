"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/adminService";
import { AdminForm, AdminNav, AdminPage, Field } from "@/components/admin/AdminTools";
export default function AdminOperationsPage() {
  const client = useQueryClient();
  const loans = useQuery({ queryKey: ["admin", "loans"], queryFn: () => adminService.searchLoans({ page: 0, size: 50 }) });
  const reservations = useQuery({ queryKey: ["admin", "reservations"], queryFn: () => adminService.reservations({ page: 0, size: 50 }) });
  const update = useMutation({ mutationFn: adminService.updateOverdueLoans, onSuccess: () => client.invalidateQueries({ queryKey: ["admin", "loans"] }) });
  return <AdminPage title="Préstamos y reservas" description="Buscá operaciones y gestioná reservas de usuarios."><AdminNav /><div className="flex gap-3"><button onClick={() => update.mutate()} className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground">Actualizar vencidos</button></div><AdminForm onSubmit={(v) => adminService.checkoutForUser(v.userId, { bookId: v.bookId, checkoutDays: Number(v.checkoutDays), notes: v.notes })}><Field name="userId" label="ID de usuario" required /><Field name="bookId" label="ID de libro" required /><Field name="checkoutDays" label="Días" type="number" /><Field name="notes" label="Notas" /></AdminForm><div className="grid gap-6 lg:grid-cols-2">{[["Préstamos", loans.data?.content], ["Reservas", reservations.data?.content]].map(([title, items]) => <section key={title as string} className="rounded-2xl border border-border/70 bg-card"><h3 className="border-b border-border/70 px-5 py-4 font-semibold">{title as string}</h3>{(items as Array<{ id: string; bookTitle: string; status: string }> | undefined)?.map((item) => <div key={item.id} className="border-b border-border/60 px-5 py-4 text-sm last:border-0"><span className="font-medium">{item.bookTitle}</span><span className="ml-3 text-muted-foreground">{item.status}</span></div>)}</section>)}</div></AdminPage>;
}
