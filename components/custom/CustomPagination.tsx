"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { PiCaretLeft, PiCaretRight } from "react-icons/pi";

import { Button } from "@/components/ui/button";

interface Props {
  totalPages: number;
  paramName?: string;
}

export const CustomPagination = ({ totalPages, paramName = "page" }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const rawPage = Number(searchParams.get(paramName) ?? "1");

  const page = Number.isInteger(rawPage) && rawPage >= 1 && rawPage <= totalPages ? rawPage : 1;

  if (totalPages <= 1) {
    return null;
  }

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set(paramName, pageNumber.toString());

    return `${pathname}?${params.toString()}`;
  };

  const getPages = () => {
    const pages: Array<number | "..."> = [];
    const delta = 2;

    const left = Math.max(2, page - delta);

    const right = Math.min(totalPages - 1, page + delta);

    pages.push(1);

    if (left > 2) {
      pages.push("...");
    }

    for (let currentPage = left; currentPage <= right; currentPage++) {
      pages.push(currentPage);
    }

    if (right < totalPages - 1) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  const pages = getPages();

  return (
    <nav aria-label="Navegación de páginas" className="flex flex-wrap items-center justify-center gap-2">
      {page === 1 ? (
        <Button type="button" variant="outline" size="sm" disabled aria-label="Página anterior">
          <PiCaretLeft className="size-4" aria-hidden="true" />
        </Button>
      ) : (
        <Button variant="outline" size="sm" asChild>
          <Link href={createPageURL(page - 1)} aria-label="Página anterior">
            <PiCaretLeft className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      )}

      {pages.map((item, index) =>
        item === "..." ? (
          <span key={`ellipsis-${index}`} className="px-2 text-sm text-muted-foreground" aria-hidden="true">
            …
          </span>
        ) : (
          <Button key={item} variant={page === item ? "default" : "outline"} size="sm" asChild>
            <Link
              href={createPageURL(item)}
              aria-label={`Página ${item}`}
              aria-current={page === item ? "page" : undefined}
            >
              {item}
            </Link>
          </Button>
        )
      )}

      {page === totalPages ? (
        <Button type="button" variant="outline" size="sm" disabled aria-label="Página siguiente">
          <PiCaretRight className="size-4" aria-hidden="true" />
        </Button>
      ) : (
        <Button variant="outline" size="sm" asChild>
          <Link href={createPageURL(page + 1)} aria-label="Página siguiente">
            <PiCaretRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      )}
    </nav>
  );
};
