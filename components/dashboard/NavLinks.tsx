"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { navLinkstype } from "@/lib/definitions";
import { cn } from "@/lib/utils";

interface NavLinksProps {
  links: navLinkstype[];
}

export const NavLinks = ({ links }: NavLinksProps) => {
  const pathname = usePathname();

  const activePath = links
    .filter((item) => pathname === item.path || pathname.startsWith(`${item.path}/`))
    .sort((a, b) => b.path.length - a.path.length)[0]?.path;

  return (
    <div className="space-y-1">
      {links.map((item) => {
        const isActive = item.path === activePath;

        const Icon = item.icon;

        return (
          <Link
            href={item.path}
            key={item.path}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
              isActive
                ? "bg-primary/10 font-medium text-primary"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            )}
          >
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-md transition-colors",
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground group-hover:text-foreground"
              )}
            >
              <Icon className="size-4.5" />
            </span>

            <span className="truncate">{item.label}</span>

            {isActive && <span className="ml-auto size-1.5 rounded-full bg-primary" />}
          </Link>
        );
      })}
    </div>
  );
};
