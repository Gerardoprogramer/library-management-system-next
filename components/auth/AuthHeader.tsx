import Link from "next/link";
import { PiBooks } from "react-icons/pi";

interface AuthHeaderProps {
  subtitle: string;
}

export const AuthHeader = ({ subtitle }: AuthHeaderProps) => {
  return (
    <div className="mb-8 flex flex-col items-center text-center">
      <Link
        href="/"
        aria-label="Volver al inicio"
        className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors hover:bg-primary/15"
      >
        <PiBooks className="size-6" />
      </Link>

      <h1 className="mt-4 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">Biblioteca Obsidian</h1>

      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{subtitle}</p>
    </div>
  );
};
