"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { AdminForm, AdminNav, AdminPage, AdminPagination, AdminSection, Field } from "@/components/admin/AdminTools";
import { AdminActionDialog } from "@/components/admin/AdminActionDialog";
import type { AdminSubscriptionPlanInput, Currency, SubscriptionPlan } from "@/lib/definitions";
import { adminService } from "@/services/adminService";
import { SubscriptionPlanService } from "@/services/subscriptionPlanService";
import { adminSubscriptionPlanCreateSchema, adminSubscriptionPlanUpdateSchema } from "@/schemas/admin.schema";

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
  const [deletingPlan, setDeletingPlan] = useState<SubscriptionPlan | null>(null);
  const [subscriptionPage, setSubscriptionPage] = useState(0);
  const plans = useQuery({
    queryKey: ["admin", "subscription-plans"],
    queryFn: SubscriptionPlanService.subscriptionPlans,
  });
  const subscriptions = useQuery({
    queryKey: ["admin", "subscriptions", subscriptionPage],
    queryFn: () =>
      adminService.subscriptions({
        page: subscriptionPage,
        size: 9,
      }),
  });
  const users = useQuery({
    queryKey: ["admin", "users"],
    queryFn: adminService.users,
  });
  const save = useMutation({
    mutationFn: async () => {
      const result = editing
        ? adminSubscriptionPlanUpdateSchema.safeParse(form)
        : adminSubscriptionPlanCreateSchema.safeParse(form);

      if (!result.success) {
        throw new Error(result.error.issues[0]?.message ?? "Los datos del plan no son válidos");
      }

      if (editing) {
        await adminService.updateSubscriptionPlan(editing.id, result.data);
        return;
      }

      await adminService.createSubscriptionPlan(result.data);
    },

    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["admin", "subscription-plans"],
      });

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

    setForm({
      planCode: plan.planCode,
      name: plan.name,
      description: plan.description,
      durationDays: plan.durationDays,
      price: plan.price,
      currency: plan.currency as Currency,
      maxBooksAllowed: plan.maxBooksAllowed,
      maxDaysPerBook: plan.maxDaysPerBook,
      displayOrder: plan.displayOrder,
      active: plan.active,
      featured: plan.featured,
      badgeText: plan.badgeText,
    });
  };

  const usersById = useMemo(() => new Map((users.data ?? []).map((user) => [user.id, user])), [users.data]);

  return (
    <AdminPage title="Suscripciones y planes" description="Administra planes, precios y membresías activas.">
      <AdminNav />
      <AdminActionDialog
        open={Boolean(deletingPlan)}
        onOpenChange={(open) => !open && setDeletingPlan(null)}
        title="Eliminar plan"
        description={`Esta acción eliminará ${deletingPlan?.name ?? "este plan"} de forma permanente.`}
        confirmLabel="Eliminar plan"
        onConfirm={() => {
          if (deletingPlan) remove.mutate(deletingPlan.id);
          setDeletingPlan(null);
        }}
      />
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
                    setDeletingPlan(plan);
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
          <AdminForm
            onSubmit={async () => {
              await save.mutateAsync();
            }}
          >
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
                min={1}
                step={1}
                required
                value={String(form.durationDays ?? 30)}
                onChange={update}
              />
              <Field
                name="price"
                label="Precio"
                type="number"
                min={1}
                step={1}
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
                min={1}
                step={1}
                required
                value={String(form.maxBooksAllowed ?? 1)}
                onChange={update}
              />
              <Field
                name="maxDaysPerBook"
                label="Días por libro"
                type="number"
                min={1}
                step={1}
                required
                value={String(form.maxDaysPerBook ?? 14)}
                onChange={update}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                name="displayOrder"
                label="Orden de visualización"
                type="number"
                step={1}
                value={String(form.displayOrder ?? 0)}
                onChange={update}
              />

              <Field name="badgeText" label="Texto del badge" value={form.badgeText ?? ""} onChange={update} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-3 rounded-xl border border-border/70 p-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.active ?? true}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      active: event.target.checked,
                    }))
                  }
                />
                <span className="font-medium">Plan activo</span>
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-border/70 p-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.featured ?? false}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      featured: event.target.checked,
                    }))
                  }
                />
                <span className="font-medium">Plan destacado</span>
              </label>
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
        title="Membresías"
        description={`${subscriptions.data?.totalElements ?? 0} membresías registradas.`}
      >
        {subscriptions.isLoading && <p className="px-5 py-8 text-sm text-muted-foreground">Cargando membresías...</p>}

        {subscriptions.isError && (
          <p role="alert" className="px-5 py-8 text-sm text-destructive">
            No se pudieron cargar las membresías.
          </p>
        )}

        {!subscriptions.isLoading && !subscriptions.isError && subscriptions.data?.content.length === 0 && (
          <p className="px-5 py-8 text-sm text-muted-foreground">No hay membresías registradas.</p>
        )}

        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {subscriptions.data?.content.map((subscription) => {
            const user = usersById.get(subscription.userId);

            return (
              <div key={subscription.id} className="rounded-xl border border-border/70 p-4">
                <p className="font-medium">{subscription.planName}</p>

                <p className="mt-2 text-sm font-medium">{user?.fullName ?? "Usuario no disponible"}</p>

                <p className="text-sm text-muted-foreground">{user?.email ?? subscription.userId}</p>

                <span
                  className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs ${
                    subscription.active ? "bg-emerald-500/12 text-emerald-600" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {subscription.active ? "Activa" : "Inactiva"}
                </span>
              </div>
            );
          })}
        </div>

        <AdminPagination
          page={subscriptions.data?.number ?? subscriptionPage}
          totalPages={subscriptions.data?.totalPages ?? 0}
          totalElements={subscriptions.data?.totalElements ?? 0}
          onPageChange={setSubscriptionPage}
        />
      </AdminSection>
    </AdminPage>
  );
}
