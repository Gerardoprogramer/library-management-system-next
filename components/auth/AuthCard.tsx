import type { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return <div className="space-y-5 rounded-2xl border border-border/70 bg-card p-6 shadow-xs sm:p-8">{children}</div>;
}
