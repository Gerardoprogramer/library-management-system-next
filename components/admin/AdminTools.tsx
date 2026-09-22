"use client";

import { type FormEvent, type ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PiArrowUpRight,
  PiBookOpenText,
  PiChartBar,
  PiCreditCard,
  PiFolderSimple,
  PiGear,
  PiUsersThree,
} from "react-icons/pi";
import type { IconType } from "react-icons";

export function AdminPage({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <div className="space-y-7">
      <header className="surface relative overflow-hidden p-6 sm:p-7">
        <div className="absolute right-0 top-0 size-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/10 blur-2xl" />
        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Centro de control</p>
            <h2 className="page-heading mt-2">{title}</h2>
            {description && <p className="page-description">{description}</p>}
          </div>
          <div className="hidden size-12 items-center justify-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/15 sm:flex">
            <PiGear className="size-6" />
          </div>
        </div>
      </header>
      {children}
    </div>
  );
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
  const pathname = usePathname();
  const sections: Array<{ href: string; label: string; icon: IconType }> = [
    { href: "/dashboard/admin", label: "Resumen", icon: PiChartBar },
    { href: "/dashboard/admin/libros", label: "Libros", icon: PiBookOpenText },
    { href: "/dashboard/admin/generos", label: "Géneros", icon: PiFolderSimple },
    { href: "/dashboard/admin/operaciones", label: "Operaciones", icon: PiGear },
    { href: "/dashboard/admin/multas", label: "Multas", icon: PiArrowUpRight },
    { href: "/dashboard/admin/pagos", label: "Pagos", icon: PiCreditCard },
    { href: "/dashboard/admin/stats", label: "Estadísticas", icon: PiChartBar },
    { href: "/dashboard/admin/suscripciones", label: "Suscripciones", icon: PiCreditCard },
    { href: "/dashboard/admin/usuarios", label: "Usuarios", icon: PiUsersThree },
  ];

  return (
    <nav aria-label="Secciones de administración" className="surface flex gap-2 overflow-x-auto p-2 text-sm">
      {sections.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || (href !== "/dashboard/admin" && pathname.startsWith(`${href}/`));

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 font-medium transition ${
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-primary/8 hover:text-foreground"
            }`}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function useAdminMutation<T>(key: string, fn: (values: T) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: fn, onSuccess: () => queryClient.invalidateQueries({ queryKey: [key] }) });
}
