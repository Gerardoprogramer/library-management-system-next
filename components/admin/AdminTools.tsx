"use client";

import { type FormEvent, type ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function AdminPage({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return <div className="space-y-8"><header><p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Administración</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h2>{description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}</header>{children}</div>;
}

export function AdminForm({ children, onSubmit, submitLabel = "Guardar" }: { children: ReactNode; onSubmit: (values: Record<string, string>) => void; submitLabel?: string }) {
  const mutation = useMutation({ mutationFn: async (values: Record<string, string>) => onSubmit(values) });
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const values = Object.fromEntries(new FormData(event.currentTarget).entries()) as Record<string, string>; mutation.mutate(values); };
  return <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border/70 bg-card p-5">{children}<button disabled={mutation.isPending} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">{mutation.isPending ? "Guardando..." : submitLabel}</button>{mutation.isError && <p className="text-sm text-destructive">{(mutation.error as Error).message}</p>}{mutation.isSuccess && <p className="text-sm text-emerald-600">Operación completada.</p>}</form>;
}

export function Field({ name, label, type = "text", required = false, onChange }: { name: string; label: string; type?: string; required?: boolean; onChange?: (name: string, value: string) => void }) {
  return <label className="block space-y-1 text-sm"><span className="font-medium">{label}</span><input name={name} type={type} required={required} onChange={(event) => onChange?.(name, event.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30" /></label>;
}

export function AdminNav() {
  return <nav className="flex flex-wrap gap-2 text-sm">{[["/dashboard/admin/libros", "Libros"], ["/dashboard/admin/generos", "Géneros"], ["/dashboard/admin/operaciones", "Préstamos y reservas"], ["/dashboard/admin/multas", "Multas"], ["/dashboard/admin/pagos", "Pagos y reembolsos"], ["/dashboard/admin/suscripciones", "Suscripciones y planes"]].map(([href, label]) => <a key={href} href={href} className="rounded-lg border border-border/70 px-3 py-2 hover:bg-muted">{label}</a>)}</nav>;
}

export function useAdminMutation<T>(key: string, fn: (values: T) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: fn, onSuccess: () => queryClient.invalidateQueries({ queryKey: [key] }) });
}
