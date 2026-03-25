'use client';

import { LogOut, Gem, X } from "lucide-react";
import { useLogout } from "@/hooks/auth/useLogout";
import { adminNav, userNav } from "@/lib/data";
import { NavLinks } from "@/components/dashboard/NavLinks";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/queries/useCurrentUser";

interface SideNavProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export const SideNav = ({ isOpen, setIsOpen }: SideNavProps) => {
  const { handleLogout, isLoading } = useLogout();

  const { data: user } = useCurrentUser();

  return (
    <>
      {/* Overlay móvil */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      <aside
        className={cn(
          "w-64 bg-card flex flex-col fixed inset-y-0 left-0 z-40 border-r border-border transform transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:static md:flex"
        )}
      >
        {/* Header móvil */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-foreground flex items-center justify-center rotate-45">
              <Gem className="w-4 h-4 text-background -rotate-45" strokeWidth={1.5} />
            </div>
            <span className="text-sm font-semibold uppercase">
              Obsidian
            </span>
          </div>

          {/* Botón cerrar solo en móvil */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <p className="px-3 mb-2 text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
            Principal
          </p>

          <NavLinks links={userNav} />

          {user?.isAdmin && (
            <>
              <div className="h-px bg-border my-4" />
              <p className="px-3 mb-2 text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                Administración
              </p>
              <NavLinks links={adminNav} />
            </>
          )}
        </nav>

        <div className="p-3 border-t border-border">
          <button
            disabled={isLoading}
            onClick={handleLogout}
            className="w-full flex items-center gap-3 text-sm px-3 py-2.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {isLoading ? "Cerrando sesión..." : "Cerrar sesión"}
          </button>
        </div>
      </aside>
    </>
  );
};