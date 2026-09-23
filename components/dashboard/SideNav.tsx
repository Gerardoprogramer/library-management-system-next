"use client";

import { PiBookOpenText, PiShieldCheck, PiSignOut, PiX } from "react-icons/pi";

import { NavLinks } from "@/components/dashboard/NavLinks";
import { useLogout } from "@/hooks/auth/useLogout";
import { useCurrentUser } from "@/hooks/queries/useCurrentUser";
import { adminNav, userNav } from "@/lib/data";
import { cn } from "@/lib/utils";

interface SideNavProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export const SideNav = ({ isOpen, setIsOpen }: SideNavProps) => {
  const { handleLogout, isLoading } = useLogout();
  const { data: user } = useCurrentUser();

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-black/45 backdrop-blur-[2px] md:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[min(19rem,calc(100vw-2rem))] flex-col border-r border-border/70 bg-card/95 shadow-2xl shadow-black/10 backdrop-blur-xl transition-transform duration-300 md:static md:w-72 md:translate-x-0 md:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-18 items-center justify-between border-b border-border/70 px-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
              <PiBookOpenText className="size-5" />
            </div>

            <div className="leading-tight">
              <p className="font-semibold tracking-tight text-foreground">Biblioteca Obsidian</p>
              <p className="text-[11px] text-muted-foreground">Tu espacio de lectura</p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setIsOpen(false)}
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
          >
            <PiX className="size-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5" onClick={() => setIsOpen(false)}>
          <div className="mb-6">
            <p className="mb-2 px-3 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground/70">
              Biblioteca
            </p>

            <NavLinks links={userNav} />
          </div>

          {user?.isAdmin && (
            <div className="mt-6 rounded-2xl border border-primary/15 bg-primary/5 p-2">
              <div className="mb-2 flex items-center gap-2 px-2 py-1.5">
                <span className="flex size-7 items-center justify-center rounded-lg bg-primary/12 text-primary">
                  <PiShieldCheck className="size-4" />
                </span>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                  Administración
                </p>
              </div>
              <NavLinks links={adminNav} />
            </div>
          )}
        </nav>

        <div className="border-t border-border/70 p-3">
          {user && (
            <div className="mb-2 rounded-xl border border-border/60 bg-muted/35 px-3 py-3">
              <p className="truncate text-sm font-medium text-foreground">{user.fullName}</p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          )}

          <button
            type="button"
            disabled={isLoading}
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:pointer-events-none disabled:opacity-50"
          >
            <span className="flex size-8 items-center justify-center rounded-md transition-colors group-hover:bg-destructive/10">
              <PiSignOut className="size-4.5" />
            </span>

            <span>{isLoading ? "Cerrando sesión..." : "Cerrar sesión"}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
