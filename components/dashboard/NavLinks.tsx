'use client';

import Link from "next/link";
import { type navLinkstype } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface NavLinksProps {
    links: navLinkstype[];
}

export const NavLinks = ({ links }: NavLinksProps) => {
    const pathname = usePathname();

    return (
        <>
            {links.map((item) => (
                <Link
                    href={item.path}
                    key={item.path}
                    className={cn(
                        "w-full flex items-center gap-3 text-sm px-3 py-2.5 rounded-md transition-colors",
                        pathname === item.path
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {item.label}
                </Link>
            ))}
        </>
    );
};