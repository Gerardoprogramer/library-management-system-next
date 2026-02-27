'use client';

import { Search, Star, BookOpen, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { bookService } from "@/services/bookService";
import { useQuery } from "@tanstack/react-query";
import { WishListService } from "@/services/wishlistService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { useSearchParams } from "next/navigation";


export default function CatalogPage() {
    const searchParams = useSearchParams();
  const queryPage = searchParams.get("page") ?? "0";
  const filters = {
    searchTerm: "",
    availableOnly: false,
    page: isNaN(+queryPage) ? 0 : +queryPage - 1,
    size: 8,
  };

  const { data: books } = useQuery({
    queryKey: ["books", filters],
    queryFn: () => bookService.search(filters),
  });

  const queryClient = useQueryClient();

  const toggleWishlistMutation = useMutation({
    mutationFn: ({ bookId, isInWishlist }: { bookId: string; isInWishlist: boolean }) =>
      isInWishlist
        ? WishListService.remove(bookId)
        : WishListService.add(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  const handleWishlistToggle = (bookId: string, isInWishlist: boolean) => {
    toggleWishlistMutation.mutate({ bookId, isInWishlist });
  };

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
      </div>

      <p className="font-body text-sm text-muted-foreground mb-6">
        {books?.totalElements} resultado{books?.totalElements !== 1 ? "s" : ""}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books?.content.map((book) => (
          <div
            key={book.id}
            className="group cursor-pointer bg-card border border-border rounded-lg overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300"
          >
            <div className="aspect-3/4 relative overflow-hidden">
              <Image
                src={book.coverImageUrl}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                width={300}
                height={400} />
              <div className="absolute top-3 right-3">
                <Badge variant={book.availableCopies > 0 ? "default" : "destructive"} className="font-body text-xs">
                  {book.availableCopies > 0 ? `${book.availableCopies} disponible${book.availableCopies > 1 ? "s" : ""}` : "No disponible"}
                </Badge>
              </div>
              <button
                onClick={() => handleWishlistToggle(book.id, book.isWishList)}
                className="absolute top-3 left-3 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center  opacity-100 transition-opacity"
                aria-label="Añadir a wishlist"
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${book.isWishList
                    ? "text-red-500 fill-red-500"
                    : "text-muted-foreground hover:text-red-500"
                    }`}
                />
              </button>
            </div>
            <div className="p-4">
              <Badge variant="outline" className="font-body text-xs mb-2">{book.genreName}</Badge>
              <h3 className="font-display text-base font-semibold text-foreground line-clamp-1 mb-1">{book.title}</h3>
              <p className="font-body text-sm text-muted-foreground mb-3">{book.author}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                  <span className="font-body text-sm font-medium text-foreground">{book.averageRating.toFixed(1)}</span>
                  <span className="font-body text-xs text-muted-foreground">({book.totalReviews})</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="font-body text-xs">{book.pages}p</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {books?.totalPages && (
          <div className="col-span-full mt-8">
            <CustomPagination totalPages={books?.totalPages} />
          </div>
        )}
      </div>


      {books?.totalElements === 0 && (
        <div className="text-center py-20">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-display text-xl text-foreground mb-2">Sin resultados</p>
          <p className="font-body text-muted-foreground">No encontramos libros con esos criterios de búsqueda</p>
        </div>
      )}
    </div>
  );
}