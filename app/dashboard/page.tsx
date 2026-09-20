"use client";

import Link from "next/link";
import {
  PiArrowRight,
  PiBookmarkSimple,
  PiBookOpen,
  PiBooks,
  PiClock,
  PiCrown,
  PiHeart,
  PiWarning,
} from "react-icons/pi";

import { useCurrentUser } from "@/hooks/queries/useCurrentUser";
import { useDashboardSummary } from "@/hooks/queries/useDashboardSummary";

export default function DashboardPage() {
  const { data: user } = useCurrentUser();

  const {
    activeLoans,
    overdueLoans,
    activeReservations,
    availableReservations,
    wishlistBooks,
    subscription,
    isLoading,
  } = useDashboardSummary();

  const firstName = user?.fullName?.split(" ")[0] ?? "lector";

  const stats = [
    {
      label: "Préstamos activos",
      value: activeLoans,
      description: overdueLoans > 0 ? `${overdueLoans} requieren atención` : "Todo al día",
      href: "/dashboard/loans",
      icon: PiBookOpen,
      alert: overdueLoans > 0,
    },
    {
      label: "Reservas activas",
      value: activeReservations,
      description:
        availableReservations > 0
          ? `${availableReservations} disponibles para retirar`
          : "Sin libros disponibles por retirar",
      href: "/dashboard/reservation",
      icon: PiBookmarkSimple,
      alert: availableReservations > 0,
    },
    {
      label: "Lista de deseos",
      value: wishlistBooks,
      description: "Libros guardados para después",
      href: "/dashboard/wishlist",
      icon: PiHeart,
      alert: false,
    },
  ];

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-2xl border border-border/70 bg-card">
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="mb-2 text-sm font-medium text-primary">Resumen de tu biblioteca</p>

            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Hola, {firstName}</h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Consultá tus préstamos, reservas y libros guardados desde un solo lugar.
            </p>
          </div>

          <Link
            href="/dashboard/catalog"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <PiBooks className="size-4.5" />
            Explorar catálogo
          </Link>
        </div>
      </section>

      {overdueLoans > 0 && !isLoading && (
        <section className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <PiWarning className="size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-medium text-foreground">
              {overdueLoans === 1 ? "Tenés un préstamo vencido" : `Tenés ${overdueLoans} préstamos vencidos`}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Revisá tus préstamos para consultar las fechas de devolución y posibles multas.
            </p>
          </div>

          <Link
            href="/dashboard/loans"
            className="hidden shrink-0 items-center gap-1 text-sm font-medium text-destructive hover:underline sm:flex"
          >
            Revisar
            <PiArrowRight className="size-4" />
          </Link>
        </section>
      )}

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Tu actividad</h2>
          <p className="mt-1 text-sm text-muted-foreground">Un vistazo rápido al estado de tu cuenta.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Link
                key={stat.label}
                href={stat.href}
                className="group rounded-2xl border border-border/70 bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>

                  <PiArrowRight className="size-4.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>

                <div className="mt-6">
                  {isLoading ? (
                    <div className="h-9 w-14 animate-pulse rounded-md bg-muted" />
                  ) : (
                    <p className="text-3xl font-semibold tracking-tight text-foreground">{stat.value}</p>
                  )}

                  <p className="mt-1 text-sm font-medium text-foreground">{stat.label}</p>

                  <p className={`mt-2 text-xs ${stat.alert ? "text-destructive" : "text-muted-foreground"}`}>
                    {stat.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold tracking-tight text-foreground">Accesos rápidos</h2>
              <p className="mt-1 text-sm text-muted-foreground">Continuá donde lo necesités.</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <QuickLink
              href="/dashboard/catalog"
              icon={PiBooks}
              title="Explorar catálogo"
              description="Descubrí libros disponibles."
            />

            <QuickLink
              href="/dashboard/loans"
              icon={PiClock}
              title="Mis préstamos"
              description="Revisá fechas y renovaciones."
            />

            <QuickLink
              href="/dashboard/reservation"
              icon={PiBookmarkSimple}
              title="Mis reservas"
              description="Consultá posiciones y disponibilidad."
            />

            <QuickLink
              href="/dashboard/wishlist"
              icon={PiHeart}
              title="Mi wishlist"
              description="Volvé a tus libros guardados."
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <PiCrown className="size-5" />
          </div>

          <div className="mt-5">
            <p className="text-sm text-muted-foreground">Suscripción</p>

            {isLoading ? (
              <div className="mt-2 space-y-2">
                <div className="h-6 w-32 animate-pulse rounded bg-muted" />
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              </div>
            ) : subscription?.active && !subscription.expired ? (
              <>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">{subscription.planName}</h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  {subscription.daysRemaining} {subscription.daysRemaining === 1 ? "día restante" : "días restantes"}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Libros</p>
                    <p className="mt-1 font-semibold text-foreground">{subscription.maxBooksAllowed}</p>
                  </div>

                  <div className="rounded-xl bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Días por libro</p>
                    <p className="mt-1 font-semibold text-foreground">{subscription.maxDaysPerBook}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">Sin plan activo</h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Consultá los planes disponibles para ampliar las opciones de préstamo.
                </p>
              </>
            )}
          </div>

          <Link
            href="/dashboard/subscription"
            className="mt-6 flex items-center justify-between rounded-xl border border-border/70 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
          >
            Gestionar suscripción
            <PiArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

interface QuickLinkProps {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

function QuickLink({ href, icon: Icon, title, description }: QuickLinkProps) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-xl border border-border/70 p-4 transition-colors hover:bg-muted/40"
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4.5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
      </div>

      <PiArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
