
import { Star, BookOpen, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { BookSummary } from "@/lib/definitions";

interface BookGridProps {
    book: BookSummary;
    handleWishlistToggle: (bookId: string, isInWishlist: boolean) => void;
}

export const BooksGrid = (props: BookGridProps) => {
    const { id, title, author, genreName, pages, availableCopies, coverImageUrl, isWishList, averageRating, totalReviews } = props.book;
    const { handleWishlistToggle } = props;

    return (
        <div
            className="group cursor-pointer bg-card border border-border rounded-lg overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300"
        >
            <div className="aspect-3/4 relative overflow-hidden">
                <Image
                    src={coverImageUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    width={300}
                    height={400} />
                <div className="absolute top-3 right-3">
                    <Badge variant={availableCopies > 0 ? "default" : "destructive"} className="font-body text-xs">
                        {availableCopies > 0 ? `${availableCopies} disponible${availableCopies > 1 ? "s" : ""}` : "No disponible"}
                    </Badge>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleWishlistToggle(id, isWishList);
                    }}
                    className="absolute top-3 left-3 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center  opacity-100 transition-opacity"
                    aria-label="Añadir a wishlist"
                >
                    <Heart
                        className={`w-4 h-4 transition-colors ${isWishList
                            ? "text-red-500 fill-red-500"
                            : "text-muted-foreground hover:text-red-500"
                            }`}
                    />
                </button>
            </div>
            <div className="p-4">
                <Badge variant="outline" className="font-body text-xs mb-2">{genreName}</Badge>
                <h3 className="font-display text-base font-semibold text-foreground line-clamp-1 mb-1">{title}</h3>
                <p className="font-body text-sm text-muted-foreground mb-3">{author}</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                        <span className="font-body text-sm font-medium text-foreground">{averageRating.toFixed(1)}</span>
                        <span className="font-body text-xs text-muted-foreground">({totalReviews})</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span className="font-body text-xs">{pages}p</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
