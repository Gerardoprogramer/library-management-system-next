import type { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="surface w-full space-y-5 border-border/60 bg-background/75 p-6 shadow-none sm:p-8">
      {children}
    </div>
  );
}
