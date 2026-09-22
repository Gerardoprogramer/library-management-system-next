"use client";

import { type FormEvent, type ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

export function AdminPage({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return <div className="space-y-8"><header><p className="eyebrow">Administración</p><h2 className="page-heading mt-2">{title}</h2>{description && <p className="page-description">{description}</p>}</header>{children}</div>;
}

export function AdminForm({ children, onSubmit, submitLabel = "Guardar" }: { children: ReactNode; onSubmit: (values: Record<string, string>) => void; submitLabel?: string }) {
  const mutation = useMutation({ mutationFn: async (values: Record<string, string>) => onSubmit(values) });
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const values = Object.fromEntries(new FormData(event.currentTarget).entries()) as Record<string, string>; mutation.mutate(values); };
  return <form onSubmit={submit} className="surface space-y-5 p-5 sm:p-6">{children}<button disabled={mutation.isPending} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:brightness-105 disabled:opacity-50">{mutation.isPending ? "Guardando..." : submitLabel}</button>{mutation.isError && <p role="alert" className="text-sm text-destructive">{(mutation.error as Error).message}</p>}{mutation.isSuccess && <p role="status" className="text-sm text-emerald-600">Operación completada.</p>}</form>;
}

export function Field({ name, label, type = "text", required = false, onChange }: { name: string; label: string; type?: string; required?: boolean; onChange?: (name: string, value: string) => void }) {
  return <label className="block space-y-1.5 text-sm"><span className="font-medium">{label}</span><input name={name} type={type} required={required} onChange={(event) => onChange?.(name, event.target.value)} className="h-11 w-full rounded-xl border border-input bg-background/70 px-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>;
}

export function AdminNav() {
  return <nav aria-label="Secciones de administración" className="flex flex-wrap gap-2 text-sm">{[["/dashboard/admin/libros", "Libros"], ["/dashboard/admin/generos", "Géneros"], ["/dashboard/admin/operaciones", "Préstamos y reservas"], ["/dashboard/admin/multas", "Multas"], ["/dashboard/admin/pagos", "Pagos y reembolsos"], ["/dashboard/admin/suscripciones", "Suscripciones y planes"]].map(([href, label]) => <Link key={href} href={href} className="rounded-xl border border-border/70 bg-card px-3.5 py-2 font-medium text-muted-foreground transition hover:border-primary/30 hover:bg-primary/5 hover:text-foreground">{label}</Link>)}</nav>;
}

export function useAdminMutation<T>(key: string, fn: (values: T) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: fn, onSuccess: () => queryClient.invalidateQueries({ queryKey: [key] }) });
}
