
interface AuthCardProps {
  children: React.ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 sm:p-8 space-y-5">
      {children}
    </div>
  );
}
