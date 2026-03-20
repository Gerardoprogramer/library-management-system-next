'use client'

import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

interface Props {
  totalPages: number;
  paramName?: string;
}

export const CustomPagination = ({
  totalPages,
  paramName = "page"
}: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const queryPage = searchParams.get(paramName) ?? "1";
  const page = isNaN(+queryPage) ? 1 : +queryPage;

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramName, pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const getPages = () => {
    const pages: (number | "...")[] = [];
    const delta = 2;

    const left = Math.max(2, page - delta);
    const right = Math.min(totalPages - 1, page + delta);

    pages.push(1);

    if (left > 2) pages.push("...");

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages - 1) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  const pages = getPages();

  return (
    <nav aria-label="Navegación de páginas" className="flex items-center justify-center gap-2 flex-wrap">

      <Button
        variant="outline"
        size="sm"
        disabled={page === 1}
        asChild={page !== 1}
      >
        {page === 1 ? (
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Link href={createPageURL(page - 1)} aria-label="Página anterior">
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </Button>


      {pages.map((p, i) =>
        p === "..." ? (
          <span key={i} className="px-2 text-muted-foreground" aria-hidden="true">
            ...
          </span>
        ) : (
          <Button
            key={i}
            variant={page === p ? "default" : "outline"}
            size="sm"
            asChild
          >
            <Link
              href={createPageURL(p)}
              aria-current={page === p ? "page" : undefined}
            >
              {p}
            </Link>
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="sm"
        disabled={page === totalPages}
        asChild={page !== totalPages}
      >
        {page === totalPages ? (
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Link href={createPageURL(page + 1)} aria-label="Siguiente página">
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </Button>

    </nav>
  );
};