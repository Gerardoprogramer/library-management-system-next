

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-6">
      
      {/* Fondo decorativo opcional */}
 {/*      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-150 bg-primary/10 blur-3xl rounded-full" />
      </div> */}

      <div className="w-full max-w-md">
        {children}
      </div>

    </div>
  );
}