"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { PiList } from "react-icons/pi";

import { SideNav } from "@/components/dashboard/SideNav";
import ThemeToggle from "@/components/landing/ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/queries/useCurrentUser";

const routeTitles = [
  { path: "/dashboard/catalog", title: "Catálogo" },
  { path: "/dashboard/book", title: "Detalle del libro" },
  { path: "/dashboard/loans", title: "Mis préstamos" },
  { path: "/dashboard/reservation", title: "Mis reservas" },
  { path: "/dashboard/wishlist", title: "Mi wishlist" },
  { path: "/dashboard/review", title: "Mis reseñas" },
  { path: "/dashboard/pay", title: "Pagos y multas" },
  { path: "/dashboard/subscription", title: "Suscripciones" },
  { path: "/dashboard/admin/usuarios", title: "Usuarios" },
  { path: "/dashboard/admin/stats", title: "Estadísticas" },
  { path: "/dashboard/admin", title: "Panel administrativo" },
];

export default function DashboardShell({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const { data: user } = useCurrentUser();

  const pageTitle =
    routeTitles
      .filter((route) => pathname === route.path || pathname.startsWith(`${route.path}/`))
      .sort((a, b) => b.path.length - a.path.length)[0]?.title ?? "Biblioteca";

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .slice(0, 2)
        .map((name) => name[0])
        .join("")
        .toUpperCase()
    : "OB";

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <SideNav isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-18 shrink-0 items-center justify-between border-b border-border/70 bg-background/80 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Abrir menú"
              onClick={() => setIsOpen(true)}
              className="flex size-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
            >
              <PiList className="size-5" />
            </button>

            <div className="min-w-0">
              <p className="eyebrow hidden sm:block">
                Biblioteca Obsidian
              </p>

              <h1 className="truncate text-lg font-semibold tracking-tight text-foreground sm:text-xl">{pageTitle}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Avatar className="size-10 border border-border/70">
              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">{initials}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-400 px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
