"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/adminService";
import { AdminForm, AdminNav, AdminPage, AdminSection, Field } from "@/components/admin/AdminTools";
export default function AdminOperationsPage() {
  const client = useQueryClient();
  const loans = useQuery({ queryKey: ["admin", "loans"], queryFn: () => adminService.searchLoans({ page: 0, size: 50 }) });
  const reservations = useQuery({ queryKey: ["admin", "reservations"], queryFn: () => adminService.reservations({ page: 0, size: 50 }) });
  const update = useMutation({ mutationFn: adminService.updateOverdueLoans, onSuccess: () => client.invalidateQueries({ queryKey: ["admin", "loans"] }) });
  return <AdminPage title="Préstamos y reservas" description="Buscá operaciones y gestioná reservas de usuarios.">
    <AdminNav />
    <div className="flex justify-end"><button onClick={() => update.mutate()} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:brightness-105">Actualizar vencidos</button></div>
    <AdminSection title="Registrar préstamo" description="Asigna un libro directamente a un usuario.">
      <AdminForm onSubmit={(v) => adminService.checkoutForUser(v.userId, { bookId: v.bookId, checkoutDays: Number(v.checkoutDays), notes: v.notes })}>
        <div className="grid gap-3 sm:grid-cols-2"><Field name="userId" label="ID de usuario" required /><Field name="bookId" label="ID de libro" required /><Field name="checkoutDays" label="Días" type="number" /><Field name="notes" label="Notas" /></div>
      </AdminForm>
    </AdminSection>
    <div className="grid gap-6 lg:grid-cols-2">{[["Préstamos", loans.data?.content], ["Reservas", reservations.data?.content]].map(([title, items]) => (
      <AdminSection key={title as string} title={title as string} description="Actividad más reciente.">
        {(items as Array<{ id: string; bookTitle: string; status: string }> | undefined)?.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 border-b border-border/60 px-5 py-4 text-sm last:border-0"><span className="font-medium">{item.bookTitle}</span><span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">{item.status}</span></div>)}
      </AdminSection>
    ))}</div>
  </AdminPage>;
}
