"use client";

import { useMemo } from "react";
import { PiBooks, PiMagnifyingGlass } from "react-icons/pi";

import { BooksGrid } from "@/components/book/BooksGrid";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomSelect } from "@/components/custom/CustomSelect";
import { BookCardSkeleton } from "@/components/custom/skeletons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useDebouncedCallback } from "@/hooks/Utilidades/useDebouncedCallback";
import { useDebouncedSearchParam } from "@/hooks/Utilidades/useDebouncedSearchParam";
import { useCurrentUrl } from "@/hooks/Utilidades/useCurrentUrl";
import { useQueryParams } from "@/hooks/Utilidades/useQueryParams";
import { useWishlistActions } from "@/hooks/mutations/useWishlistActions";
import { useCatalogo } from "@/hooks/queries/useCatalogo";
import { createSlug } from "@/lib/slug-utils";

export const CatalogClient = () => {
  const queryParams = useQueryParams();
  const currentUrl = useCurrentUrl();

  const { books, filters, genres, isLoading, setGenre, toggleAvailableOnly } = useCatalogo();
  const { mutate: handleWishlistToggle } = useWishlistActions();

  const { value: search, setValue: setSearch } = useDebouncedSearchParam("searchTerm", 500);

  const genreOptions = useMemo(() => genres.map((genre) => ({ id: genre.id, name: genre.name })), [genres]);

  const debouncedWishlistToggle = useDebouncedCallback((bookId: string, isInWishlist: boolean) => {
    handleWishlistToggle({ bookId, isInWishlist });
  }, 300);

  const getBookHref = (bookId: string, title: string) => {
    const params = new URLSearchParams(queryParams);

    params.set("from", currentUrl);

    return `/dashboard/book/${createSlug(bookId, title)}?${params.toString()}`;
  };

  const totalBooks = books?.totalElements ?? 0;

  return (
    <div className="space-y-6">
      <section className="surface p-5 sm:p-6">
        <div className="mb-6">
          <p className="text-sm font-medium text-primary">Colección</p>

          <h2 className="page-heading mt-1">
            Encontrá tu próxima lectura
          </h2>

          <p className="page-description">
            Buscá por título, autor o ISBN y filtrá la colección según género y disponibilidad.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center">
          <div className="relative">
            <PiMagnifyingGlass className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por título, autor o ISBN..."
              className="h-11 rounded-xl pl-10"
            />
          </div>

          <CustomSelect
            options={genreOptions}
            headline="Todos los géneros"
            selectedItem={filters.genre}
            setSelectedItem={setGenre}
          />

          <div className="flex h-11 items-center justify-between gap-3 rounded-xl border border-input bg-background/70 px-4 lg:justify-start">
            <div>
              <Label htmlFor="available" className="cursor-pointer text-sm font-medium">
                Solo disponibles
              </Label>
            </div>

            <Switch id="available" checked={filters.availableOnly} onCheckedChange={toggleAvailableOnly} />
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Libros</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {isLoading ? "Buscando libros..." : `${totalBooks} ${totalBooks === 1 ? "resultado" : "resultados"}`}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <BookCardSkeleton key={index} />
            ))}
          </div>
        ) : totalBooks > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {books?.content.map((book) => (
                <BooksGrid
                  key={book.id}
                  book={book}
                  href={getBookHref(book.id, book.title)}
                  handleWishlistToggle={debouncedWishlistToggle}
                />
              ))}
            </div>

            {books && books.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <CustomPagination totalPages={books.totalPages} paramName="CatalogPage" />
              </div>
            )}
          </>
        ) : (
          <div className="surface-muted flex min-h-80 flex-col items-center justify-center border-dashed px-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <PiBooks className="size-7" />
            </div>

            <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">No encontramos libros</h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Probá con otro título, autor, ISBN o cambiá los filtros seleccionados.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
