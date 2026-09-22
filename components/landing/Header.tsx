import Link from "next/link";
import { PiBooks } from "react-icons/pi";

import ThemeToggle from "@/components/landing/ThemeToggle";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/72 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Biblioteca Obsidian">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/15">
            <PiBooks className="size-5" />
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold tracking-tight text-foreground">Biblioteca Obsidian</p>

            <p className="text-[11px] text-muted-foreground">Gestión bibliotecaria</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Button asChild variant="ghost" size="sm">
            <Link href="/auth/login">Iniciar sesión</Link>
          </Button>

          <Button asChild size="sm">
            <Link href="/auth/register">Crear cuenta</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
