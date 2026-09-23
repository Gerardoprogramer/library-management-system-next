import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background px-4 py-8 sm:px-6 lg:py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_color-mix(in_oklab,var(--primary)_14%,transparent),transparent_44%)]" />
      <div className="pointer-events-none absolute -left-24 top-1/3 size-72 rounded-full bg-primary/8 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 size-72 rounded-full bg-accent/60 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-border/70 bg-card/70 shadow-2xl shadow-primary/10 backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative hidden overflow-hidden bg-[#201d1b] p-10 text-white lg:flex lg:min-h-170 lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,color-mix(in_oklab,var(--primary)_35%,transparent),transparent_24rem)]" />
          <div className="absolute bottom-0 right-0 size-72 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative">
            <Link
              href="/"
              className="inline-flex items-center gap-3 text-sm font-semibold text-white transition hover:text-primary"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                B
              </span>
              Biblioteca Obsidian
            </Link>
            <p className="mt-16 max-w-sm text-4xl font-semibold leading-tight tracking-tight">
              Una forma más clara de descubrir y disfrutar tus lecturas.
            </p>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/60">
              Consulta el catálogo, reserva ejemplares y mantén tus préstamos organizados desde cualquier lugar.
            </p>
          </div>
          <div className="relative grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
              <p className="font-medium">Catálogo</p>
              <p className="mt-1 text-xs text-white/55">Encuentra tu próxima lectura.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
              <p className="font-medium">Préstamos</p>
              <p className="mt-1 text-xs text-white/55">Todo bajo control.</p>
            </div>
          </div>
        </aside>

        <div className="flex items-center justify-center p-5 sm:p-10 lg:p-14">{children}</div>
      </div>
    </main>
  );
}
