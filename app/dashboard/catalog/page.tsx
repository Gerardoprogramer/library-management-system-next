'use client';

import { Search, BookOpen, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { BookCardSkeleton } from "@/components/custom/skeletons";
import { BooksGrid } from "@/components/book/BooksGrid";
import { useCatalogo } from "@/hooks/useCatalogo";
import { SelectGenre } from "@/components/genre/SelectGenre";

export default function CatalogPage() {

  const { books, genres, selectedGenre, setSelectedGenre,
     isLoading, isFetching, handleWishlistToggle } = useCatalogo();

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground mb-2">
          Catálogo
        </h1>
        <p className="font-body text-lg text-muted-foreground">
          Explora nuestra colección de {books?.totalElements || 0} volúmenes
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título, autor o ISBN..."
            className="pl-10 font-body"
          />
        </div>
        <div className="flex gap-2">
          <SelectGenre genres={genres} selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} />
        </div>
      </div>

      <p className="font-body text-sm text-muted-foreground mb-6">
        {books?.totalElements} resultado{books?.totalElements !== 1 ? "s" : ""}
      </p>

      <div className="relative">
        {isFetching && !isLoading && (
          <div className="absolute -top-4 left-0 w-full h-1 bg-primary/20 overflow-hidden rounded">
            <div className="h-full w-full bg-primary animate-pulse" />
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books?.content.map((book) => (
              <BooksGrid
                key={book.id}
                book={book}
                handleWishlistToggle={handleWishlistToggle}
              />
            ))}
          </div>
        )}
      </div>

      {books && books.totalPages > 1 && (
        <div className="col-span-full mt-8">
          <CustomPagination totalPages={books.totalPages} />
        </div>
      )}

      {!isLoading && books?.totalElements === 0 && (
        <div className="text-center py-20">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-display text-xl text-foreground mb-2">Sin resultados</p>
          <p className="font-body text-muted-foreground">No encontramos libros con esos criterios de búsqueda</p>
        </div>
      )}
    </div>
  );
}