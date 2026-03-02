'use client';

import { bookService } from "@/services/bookService";
import { useQuery } from "@tanstack/react-query";

import { ArrowLeft, Star, BookOpen, Calendar, Globe, Hash, Heart, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { reviewService } from "@/services/reviewService";
import { useRouter } from "next/navigation";

export const BookDetail = ({ id }: { id: string }) => {

  const router = useRouter();

  const { data: book } = useQuery({
    queryKey: ["book", id],
    queryFn: () => bookService.book(id),
    enabled: !!id,
  });

  const { data: reviews } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => reviewService.getBookReviews(id),
    enabled: !!id,
  });

  console.log("Reseñas:", reviews);

  if (!book) {
    return (
      <div className="pt-12 text-center">
        <p className="font-display text-2xl text-foreground">Libro no encontrado</p>
        <Button variant="outline" className="mt-4">
          Volver al catálogo
        </Button>
      </div>
    );
  }


  return (
    <div>
      <Button
       onClick={() => router.back()}
       variant="ghost" className="mb-6 font-body gap-2">
        <ArrowLeft className="w-4 h-4" /> Volver
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cover */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-4">
            <div className="aspect-3/4 rounded-lg overflow-hidden border border-border shadow-xl">
              <Image src={book?.coverImageUrl} alt={book?.title} width={300} height={400} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 font-display tracking-wider text-sm" disabled={book.availableCopies === 0}>
                {book.availableCopies > 0 ? "Solicitar Préstamo" : "Reservar"}
              </Button>
              <button
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
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <Badge variant="outline" className="font-body mb-3">{book.genreName}</Badge>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground mb-2">{book.title}</h1>
            <p className="font-body text-xl text-muted-foreground mb-4">{book.author}</p>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-primary text-primary" />
                <span className="font-display text-lg font-semibold">{book.averageRating}</span>
                <span className="font-body text-sm text-muted-foreground">({book.totalReviews} reseñas)</span>
              </div>
              <Badge variant={book.availableCopies > 0 ? "default" : "destructive"}>
                {book.availableCopies > 0 ? `${book.availableCopies} de ${book.totalCopies} disponibles` : "No disponible"}
              </Badge>
            </div>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold mb-3 text-foreground">Sinopsis</h2>
            <p className="font-body text-base text-muted-foreground leading-relaxed">{book.description}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Calendar, label: "Publicado", value: book.publishedDate.toString() },
              { icon: BookOpen, label: "Páginas", value: book.pages.toString() },
              { icon: Globe, label: "Idioma", value: book.language },
              { icon: Hash, label: "ISBN", value: book.isbn.slice(-8) },
            ].map((item) => (
              <div key={item.label} className="bg-card border border-border rounded-lg p-4">
                <item.icon className="w-4 h-4 text-primary mb-2" />
                <p className="font-body text-xs text-muted-foreground">{item.label}</p>
                <p className="font-display text-sm font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Reseñas
            </h2>
            {reviews && reviews.totalElements > 0 ? (
              <div className="space-y-4">
                {reviews.content.map((review) => (
                  <div key={review.id} className="bg-card border border-border rounded-lg p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-display text-sm font-semibold text-foreground">{review.userName}</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-primary text-primary" : "text-muted"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="font-body text-sm text-muted-foreground">{review.reviewText}</p>
                    <p className="font-body text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {review.createdAt}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-body text-muted-foreground text-sm">Aún no hay reseñas para este libro.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
