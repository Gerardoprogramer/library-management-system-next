'use client';

import { Search, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { BookCardSkeleton } from "@/components/custom/skeletons";
import { BooksGrid } from "@/components/book/BooksGrid";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useDebouncedSearchParam } from "@/hooks/Utilidades/useDebouncedSearchParam";
import { CustomSelect } from "@/components/custom/CustomSelect";
import { useMemo } from "react";
import { useCurrentUrl } from "@/hooks/Utilidades/useCurrentUrl";
import { useQueryParams } from "@/hooks/Utilidades/useQueryParams";
import { createSlug } from "@/lib/slug-utils"
import { useDebouncedCallback } from "@/hooks/Utilidades/useDebouncedCallback";
import { useWishlistActions } from "@/hooks/mutations/useWishlistActions";
import { useBook } from "@/hooks/queries/useBook";
import { useCatalogo } from "@/hooks/queries/useCatalogo";

export const CatalogClient = () => {
    const queryParams = useQueryParams();
    const currentUrl = useCurrentUrl();

    const { books, filters, genres, isLoading, setGenre, toggleAvailableOnly } = useCatalogo();


    const { mutate: handleWishlistToggle } = useWishlistActions();

    const { value: search, setValue: setSearch } = useDebouncedSearchParam("searchTerm", 500);

    const genreOptions = useMemo(
        () => genres.map(g => ({ id: g.id, name: g.name })),
        [genres]
    )

    const debouncedToggle = useDebouncedCallback(
        (bookId: string, isInWishlist: boolean) => {
            handleWishlistToggle({ bookId, isInWishlist });
        },
        300
    );

    return (
        <div>
            <div className="mb-10">
                <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground mb-2">
                    Catálogo
                </h1>
                <p className="font-body text-lg text-muted-foreground">
                    Explora nuestra colección de {books?.totalElements ?? 0} volúmenes
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por título, autor o ISBN..."
                        className="pl-10 font-body"
                    />
                </div>
                <div className="flex gap-2">
                    <CustomSelect
                        options={genreOptions}
                        headline="Todos los Géneros"
                        selectedItem={filters.genre}
                        setSelectedItem={setGenre}
                    />
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="available"
                            checked={filters.availableOnly}
                            onCheckedChange={toggleAvailableOnly}
                        />
                        <Label htmlFor="available">Solo disponibles</Label>
                    </div>
                </div>
            </div>

            <p className="font-body text-sm text-muted-foreground mb-6">
                {books?.totalElements} resultado{books?.totalElements !== 1 ? "s" : ""}
            </p>

            <div className="relative">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {isLoading
                        ? Array.from({ length: 8 }).map((_, i) => (
                            <BookCardSkeleton key={i} />
                        ))
                        : books?.content.map((book) => (
                            <Link key={book.id}
                                href={{
                                    pathname: `/dashboard/book/${createSlug(book.id, book.title)}`,
                                    query: {
                                        ...queryParams,
                                        from: currentUrl
                                    }
                                }}
                            >
                                <BooksGrid
                                    book={book}
                                    handleWishlistToggle={debouncedToggle}
                                />
                            </Link>
                        ))}
                </div>
            </div>

            {books && books.totalPages > 1 && (
                <div className="col-span-full mt-8">
                    <CustomPagination
                        totalPages={books.totalPages}
                        paramName="CatalogPage" />
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
