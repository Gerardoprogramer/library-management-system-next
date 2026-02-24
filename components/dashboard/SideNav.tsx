'use client';

import { LogOut, Gem } from "lucide-react";
import { useLogout } from "@/hooks/useAuth";
import { adminNav, userNav } from "@/lib/navData";
import { userService } from "@/services/userService";
import { useQuery } from "@tanstack/react-query";
import { NavLinks } from "@/components/dashboard/NavLinks";

export const SideNav = () => {
  const { handleLogout } = useLogout();

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: userService.me,
  });

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col fixed inset-y-0 left-0 z-40">

      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-border shrink-0">
        <div className="w-8 h-8 bg-foreground flex items-center justify-center rotate-45">
          <Gem className="w-4 h-4 text-background -rotate-45" strokeWidth={1.5} />
        </div>
        <span className="font-display text-sm font-semibold tracking-wider uppercase">
          Obsidian
        </span>
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

      <div className="p-3 border-t border-border shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 text-sm px-3 py-2.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};