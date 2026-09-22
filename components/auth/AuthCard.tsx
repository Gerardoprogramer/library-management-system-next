import type { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="surface space-y-5 p-6 shadow-xl shadow-primary/5 sm:p-8">
      {children}
    </div>
  );
}
