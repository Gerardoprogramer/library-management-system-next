
import { Gem } from "lucide-react";
import { Button } from '@/components/ui/button';
import ThemeToggle from "@/components/landing/ThemeToggle";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="container mx-auto px-6 lg:px-21  sm:px16 h-16 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-8 h-8 bg-foreground flex items-center justify-center rotate-45">
            <Gem className="w-4 h-4 text-background -rotate-45" strokeWidth={1.5} />
          </div>
          <span className="text-base font-bold tracking-widest text-foreground uppercase hidden sm:block">
            Obsidian
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="text-sm"
          >
            Entrar
          </Button>
          <Button
            size="sm"
            className="tracking-wider uppercase text-xs"
          >
            Registro
          </Button>
        </div>
      </div>
    </header>
  )
}
