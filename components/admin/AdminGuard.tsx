"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PiShieldCheck } from "react-icons/pi";

import { useCurrentUser } from "@/hooks/queries/useCurrentUser";

export function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isLoading, isError } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      router.replace(`/auth/login?reason=session_expired&callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!isLoading && user && !user.isAdmin) {
      router.replace("/dashboard?reason=access_denied");
    }
  }, [isError, isLoading, pathname, router, user]);

  if (isLoading || !user || !user.isAdmin) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="surface flex max-w-sm flex-col items-center p-8 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
            <PiShieldCheck className="size-6" />
          </span>
          <p className="mt-4 font-semibold">Verificando permisos</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Comprobamos que tu cuenta tenga acceso al área administrativa.
          </p>
        </div>
      </div>
    );
  }

  return children;
}
