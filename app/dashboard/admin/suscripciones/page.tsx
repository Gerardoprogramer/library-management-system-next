"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { AdminForm, AdminNav, AdminPage, AdminSection, Field } from "@/components/admin/AdminTools";
import type { AdminSubscriptionPlanInput, Currency, SubscriptionPlan } from "@/lib/definitions";
import { adminService } from "@/services/adminService";
import { SubscriptionPlanService } from "@/services/subscriptionPlanService";

const initial: AdminSubscriptionPlanInput = {
  planCode: "",
  name: "",
  description: "",
  durationDays: 30,
  price: 1,
  currency: "USD",
  maxBooksAllowed: 1,
  maxDaysPerBook: 14,
  displayOrder: 0,
  active: true,
  featured: false,
  badgeText: "",
};

export default function AdminSubscriptionsPage() {
  const client = useQueryClient();
  const [editing, setEditing] = useState<SubscriptionPlan | null>(null);
  const [form, setForm] = useState<AdminSubscriptionPlanInput>(initial);
  const plans = useQuery({
    queryKey: ["admin", "subscription-plans"],
    queryFn: SubscriptionPlanService.subscriptionPlans,
  });
  const subscriptions = useQuery({
    queryKey: ["admin", "subscriptions"],
    queryFn: () => adminService.subscriptions({ page: 0, size: 50 }),
  });
  const save = useMutation({
    mutationFn: () =>
      editing ? adminService.updateSubscriptionPlan(editing.id, form) : adminService.createSubscriptionPlan(form),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["admin", "subscription-plans"] });
      setEditing(null);
      setForm(initial);
    },
  });
  const remove = useMutation({
    mutationFn: (id: string) => adminService.deleteSubscriptionPlan(id),
    onSuccess: () => client.invalidateQueries({ queryKey: ["admin", "subscription-plans"] }),
  });
  const deactivate = useMutation({
    mutationFn: adminService.deactivateExpiredSubscriptions,
    onSuccess: () => client.invalidateQueries({ queryKey: ["admin", "subscriptions"] }),
  });
  const update = (name: string, value: string) => {
    const key = name as keyof AdminSubscriptionPlanInput;
    setForm((current) => ({
      ...current,
      [key]: ["durationDays", "price", "maxBooksAllowed", "maxDaysPerBook", "displayOrder"].includes(key)
        ? Number(value)
        : value,
    }));
  };
  const edit = (plan: SubscriptionPlan) => {
    setEditing(plan);
    setForm({ ...plan, currency: plan.currency as Currency, adminNotes: "" });
  };

  return (
    <AdminPage title="Suscripciones y planes" description="Administra planes, precios y membresías activas.">
      <AdminNav />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => deactivate.mutate()}
          disabled={deactivate.isPending}
          className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
        >
          {deactivate.isPending ? "Actualizando..." : "Desactivar vencidas"}
        </button>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <AdminSection title="Planes disponibles" description={`${plans.data?.totalElements ?? 0} planes configurados.`}>
          {plans.isLoading && <p className="p-5 text-sm text-muted-foreground">Cargando planes...</p>}
          {plans.data?.content.map((plan) => (
            <div
              key={plan.id}
              className="flex flex-col gap-3 border-b border-border/60 px-5 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{plan.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.planCode} · {plan.price} {plan.currency} · {plan.maxBooksAllowed} libros
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${plan.active ? "bg-emerald-500/12 text-emerald-600" : "bg-muted text-muted-foreground"}`}
                >
                  {plan.active ? "Activo" : "Inactivo"}
                </span>
                <button
                  type="button"
                  onClick={() => edit(plan)}
                  className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`¿Eliminar ${plan.name}?`)) remove.mutate(plan.id);
                  }}
                  className="rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </AdminSection>
        <AdminSection
          title={editing ? "Editar plan" : "Crear plan"}
          description="Define límites y precio de una membresía."
        >
          <AdminForm onSubmit={() => save.mutate()}>
            {!editing && (
              <Field name="planCode" label="Código" required value={form.planCode ?? ""} onChange={update} />
            )}
            <Field name="name" label="Nombre" required value={form.name ?? ""} onChange={update} />
            <Field name="description" label="Descripción" value={form.description ?? ""} onChange={update} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                name="durationDays"
                label="Duración (días)"
                type="number"
                required
                value={String(form.durationDays ?? 30)}
                onChange={update}
              />
              <Field
                name="price"
                label="Precio"
                type="number"
                required
                value={String(form.price ?? 1)}
                onChange={update}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                name="maxBooksAllowed"
                label="Máximo de libros"
                type="number"
                required
                value={String(form.maxBooksAllowed ?? 1)}
                onChange={update}
              />
              <Field
                name="maxDaysPerBook"
                label="Días por libro"
                type="number"
                required
                value={String(form.maxDaysPerBook ?? 14)}
                onChange={update}
              />
            </div>
            <label className="block space-y-2 text-sm">
              <span className="font-medium">Moneda</span>
              <select
                name="currency"
                value={form.currency ?? "USD"}
                onChange={(event) => update("currency", event.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-background px-3"
              >
                <option>USD</option>
                <option>CRC</option>
                <option>EUR</option>
              </select>
            </label>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setForm(initial);
                }}
                className="mr-3 text-sm font-medium text-primary"
              >
                Cancelar edición
              </button>
            )}
          </AdminForm>
        </AdminSection>
      </div>
      <AdminSection
        title="Membresías activas"
        description={`${subscriptions.data?.totalElements ?? 0} registros recientes.`}
      >
        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {subscriptions.data?.content.map((subscription) => (
            <div key={subscription.id} className="rounded-xl border border-border/70 p-4">
              <p className="font-medium">{subscription.planName}</p>
              <p className="mt-1 text-sm text-muted-foreground">{subscription.userId}</p>
              <span className="mt-3 inline-flex rounded-full bg-emerald-500/12 px-2.5 py-1 text-xs text-emerald-600">
                {subscription.active ? "Activa" : "Inactiva"}
              </span>
            </div>
          ))}
        </div>
      </AdminSection>
    </AdminPage>
  );
}
