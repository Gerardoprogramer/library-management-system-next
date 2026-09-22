"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/adminService";
import { AdminForm, AdminNav, AdminPage, AdminSection, Field } from "@/components/admin/AdminTools";
export default function AdminSubscriptionsPage() {
  const client = useQueryClient();
  const subscriptions = useQuery({ queryKey: ["admin", "subscriptions"], queryFn: () => adminService.subscriptions({ page: 0, size: 50 }) });
  const deactivate = useMutation({ mutationFn: adminService.deactivateExpiredSubscriptions, onSuccess: () => client.invalidateQueries({ queryKey: ["admin", "subscriptions"] }) });
  return <AdminPage title="Suscripciones y planes" description="Administrá planes y mantené actualizado el estado de membresías.">
    <AdminNav />
    <div className="flex justify-end"><button onClick={() => deactivate.mutate()} className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition hover:bg-muted">Desactivar vencidas</button></div>
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <AdminSection title="Planes disponibles" description="Membresías configuradas para tus lectores.">
        {subscriptions.isLoading ? <p className="p-5 text-sm text-muted-foreground">Cargando...</p> : subscriptions.data?.content.map((subscription) => (
          <div key={subscription.id} className="flex items-center justify-between gap-4 border-b border-border/60 px-5 py-4 last:border-0">
            <div><p className="font-medium">{subscription.planName}</p><p className="mt-1 text-sm text-muted-foreground">{subscription.planCode}</p></div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${subscription.active ? "bg-emerald-500/12 text-emerald-600" : "bg-muted text-muted-foreground"}`}>{subscription.active ? "Activa" : "Inactiva"}</span>
          </div>
        ))}
      </AdminSection>
      <AdminSection title="Crear plan" description="Define límites y precio de una nueva membresía.">
        <AdminForm onSubmit={(v) => adminService.createSubscriptionPlan({ ...v, durationDays: Number(v.durationDays), price: Number(v.price), maxBooksAllowed: Number(v.maxBooksAllowed), maxDaysPerBook: Number(v.maxDaysPerBook), displayOrder: Number(v.displayOrder) })}>
          <Field name="planCode" label="Código" required /><Field name="name" label="Nombre" required /><Field name="description" label="Descripción" />
          <Field name="durationDays" label="Duración (días)" type="number" /><Field name="price" label="Precio" type="number" />
          <Field name="maxBooksAllowed" label="Máximo de libros" type="number" /><Field name="maxDaysPerBook" label="Días por libro" type="number" /><Field name="displayOrder" label="Orden" type="number" />
        </AdminForm>
      </AdminSection>
    </div>
  </AdminPage>;
}
