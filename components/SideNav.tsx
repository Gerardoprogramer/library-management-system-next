'use client';

import { LogOut, Gem } from "lucide-react";
import ThemeToggle from './landing/ThemeToggle'
import { useLogout } from "@/hooks/useAuth";

export const SideNav = () => {
const { handleLogout } = useLogout();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col fixed inset-y-0 left-0 z-40">
        {/* Logo */}
        <div
          className="h-16 flex items-center gap-2.5 px-5 border-b border-border cursor-pointer shrink-0"
        >
          <div className="w-8 h-8 rounded-sm bg-foreground flex items-center justify-center rotate-45">
            <Gem className="w-4 h-4 text-background -rotate-45" strokeWidth={1.5} />
          </div>
          <span className="font-display text-sm font-semibold text-foreground tracking-wider uppercase">
            Obsidian
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <p className="px-3 mb-2 font-display text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
            Principal
          </p>


        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-border shrink-0">
          <button
            className="w-full flex items-center gap-3 font-body text-sm px-3 py-2.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-64">
        {/* Top bar */}
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-end px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="flex items-center gap-2">
              <span className="font-body text-sm text-muted-foreground hidden sm:block">Obsidian</span>

            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
        </main>
      </div>
    </div>
  )
}
