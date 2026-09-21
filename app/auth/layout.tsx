export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-primary/4 via-transparent to-transparent" />

      <div className="relative w-full max-w-md">{children}</div>
    </main>
  );
}
