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

export function AdminMetric({
  label,
  value,
  detail,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string | number;
  detail?: string;
  icon: IconType;
  tone?: "primary" | "blue" | "green" | "orange";
}) {
  const tones = {
    primary: "bg-primary/12 text-primary",
    blue: "bg-sky-500/12 text-sky-600 dark:text-sky-400",
    green: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400",
    orange: "bg-orange-500/12 text-orange-600 dark:text-orange-400",
  };

  return (
    <article className="surface group p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <span className={`flex size-11 items-center justify-center rounded-2xl ${tones[tone]}`}>
          <Icon className="size-5" />
        </span>
        <span className="text-xs text-muted-foreground">Actualizado ahora</span>
      </div>
      <p className="mt-5 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight">{value}</p>
      {detail && <p className="mt-2 text-xs text-muted-foreground">{detail}</p>}
    </article>
  );
}

export function AdminSection({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="surface overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h3 className="font-semibold tracking-tight">{title}</h3>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function AdminPage({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-7">
      <header className="surface relative overflow-hidden p-6 sm:p-8">
        <div className="absolute right-0 top-0 size-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/10 blur-2xl" />
        <div className="absolute bottom-0 left-1/2 h-px w-1/2 bg-linear-to-r from-transparent via-primary/30 to-transparent" />
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

export function AdminForm({
  children,
  onSubmit,
  submitLabel = "Guardar",
}: {
  children: ReactNode;
  onSubmit: (values: Record<string, string>) => void | Promise<void>;
  submitLabel?: string;
}) {
  const mutation = useMutation({ mutationFn: async (values: Record<string, string>) => onSubmit(values) });
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget).entries()) as Record<string, string>;
    mutation.mutate(values);
  };
  return (
    <form onSubmit={submit} className="space-y-5 p-5 sm:p-6">
      <div className="space-y-4">{children}</div>
      <div className="flex flex-col gap-3 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-h-5 text-sm">
          {mutation.isError && (
            <p role="alert" className="text-destructive">
              {(mutation.error as Error).message}
            </p>
          )}
          {mutation.isSuccess && (
            <p role="status" className="text-emerald-600">
              Operación completada.
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:brightness-105 disabled:opacity-50"
        >
          {mutation.isPending ? "Guardando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

export function Field({
  name,
  label,
  type = "text",
  required = false,
  value,
  onChange,
  step,
  min,
  disabled = false,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  value?: string;
  onChange?: (name: string, value: string) => void;
  step?: string | number;
  min?: string | number;
  disabled?: boolean;
}) {
  return (
    <label className="block space-y-2 text-sm">
      <span className="flex items-center gap-1 font-medium">
        {label}
        {required && (
          <span className="text-primary" aria-hidden="true">
            *
          </span>
        )}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        value={value}
        step={step}
        min={min}
        disabled={disabled}
        onChange={(event) => onChange?.(name, event.target.value)}
        className="h-11 w-full rounded-xl border border-input bg-background/70 px-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </label>
  );
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
    <nav aria-label="Secciones de administración" className="surface p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Administración</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Gestiona el funcionamiento de la biblioteca.</p>
        </div>
        <PiGear className="size-5 text-primary" />
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/dashboard/admin" && pathname.startsWith(`${href}/`));

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`inline-flex min-h-12 items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left font-medium transition ${
                isActive
                  ? "border-primary/20 bg-primary/10 text-primary shadow-sm"
                  : "border-transparent text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground"
              }`}
            >
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${isActive ? "bg-primary/15" : "bg-muted"}`}
              >
                <Icon className="size-4" />
              </span>
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function AdminPagination({
  page,
  totalPages,
  totalElements,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 border-t border-border/60 px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-muted-foreground">
        Página {page + 1} de {totalPages} · {totalElements} resultados
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-border px-3 py-2 font-medium transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
        >
          Anterior
        </button>
        <button
          type="button"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-border px-3 py-2 font-medium transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export function useAdminMutation<T>(key: string, fn: (values: T) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: fn, onSuccess: () => queryClient.invalidateQueries({ queryKey: [key] }) });
}
