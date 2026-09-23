import Link from "next/link";
import { PiArrowLeft, PiBooks } from "react-icons/pi";

interface AuthHeaderProps {
  subtitle: string;
  description?: string;
  title?: string;
  eyebrow?: string;
}

export const AuthHeader = ({
  subtitle,
  description,
  title = "Biblioteca Obsidian",
  eyebrow = "Tu biblioteca, siempre contigo",
}: AuthHeaderProps) => {
  return (
    <div className="mb-7 w-full">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <PiArrowLeft className="size-4" />
        Volver a la página principal
      </Link>

      <div className="mt-8 flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/15">
          <PiBooks className="size-6" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>
          <p className="mt-1 text-sm font-semibold text-foreground">{title}</p>
        </div>
      </div>

      <h1 className="mt-8 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{subtitle}</h1>
      {description && <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>}
    </div>
  );
};
