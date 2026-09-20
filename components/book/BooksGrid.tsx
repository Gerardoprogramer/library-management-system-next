import Image from "next/image";
import Link from "next/link";
import { PiBookOpen, PiHeart, PiHeartFill, PiStarFill } from "react-icons/pi";

import { Badge } from "@/components/ui/badge";
import type { BookSummary } from "@/lib/definitions";

interface BookGridProps {
  book: BookSummary;
  href?: string;
  handleWishlistToggle: (bookId: string, isInWishlist: boolean) => void;
}

export const BooksGrid = ({ book, href, handleWishlistToggle }: BookGridProps) => {
  const {
    id,
    title,
    author,
    genreName,
    pages,
    availableCopies,
    coverImageUrl,
    isWishList,
    averageRating,
    totalReviews,
  } = book;

  const content = (
    <>
      <div className="relative aspect-3/4 overflow-hidden bg-muted">
        <Image
          src={coverImageUrl}
          alt={`Portada de ${title}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />

        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/55 to-transparent" />

        <Badge
          variant={availableCopies > 0 ? "default" : "destructive"}
          className="absolute right-3 top-3 border-0 shadow-sm"
        >
          {availableCopies > 0 ? `${availableCopies} disponible${availableCopies === 1 ? "" : "s"}` : "No disponible"}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3">
          <Badge variant="outline" className="max-w-full font-normal text-muted-foreground">
            <span className="truncate">{genreName}</span>
          </Badge>
        </div>

        <h3 className="line-clamp-2 text-base font-semibold leading-snug tracking-tight text-foreground">{title}</h3>

        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{author}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <div className="flex items-center gap-1.5">
            <PiStarFill className="size-4 text-primary" />

            <span className="text-sm font-medium text-foreground">{averageRating.toFixed(1)}</span>

            <span className="text-xs text-muted-foreground">({totalReviews})</span>
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground">
            <PiBookOpen className="size-4" />
            <span className="text-xs">{pages} pág.</span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
          handleWishlistToggle(id, isWishList);
        }}
        aria-label={isWishList ? `Eliminar ${title} de la wishlist` : `Agregar ${title} a la wishlist`}
        className="absolute left-3 top-3 z-10 flex size-9 items-center justify-center rounded-full border border-white/10 bg-background/90 text-muted-foreground shadow-sm backdrop-blur-md transition-colors hover:text-destructive"
      >
        {isWishList ? <PiHeartFill className="size-4.5 text-destructive" /> : <PiHeart className="size-4.5" />}
      </button>

      {href ? (
        <Link
          href={href}
          className="flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {content}
        </Link>
      ) : (
        content
      )}
    </article>
  );
};
