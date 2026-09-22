export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_color-mix(in_oklab,var(--primary)_14%,transparent),transparent_44%)]" />
      <div className="pointer-events-none absolute -left-24 top-1/3 size-72 rounded-full bg-primary/8 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 size-72 rounded-full bg-accent/60 blur-3xl" />

      <div className="relative w-full max-w-md">{children}</div>
    </main>
  );
}
