
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface BookSideProps {
    book: {
        id: string;
        title: string;
        coverImageUrl: string;
        availableCopies: number;
        isWishList: boolean;
    };
    handleWishlistToggle: (bookId: string, isWishList: boolean) => void;
}
export const BookSide = ({ book, handleWishlistToggle }: BookSideProps) => {

    return (
        <div className="lg:col-span-1 h-full">
            <div className="sticky top-20 space-y-4">
                <div className="aspect-3/4 rounded-lg overflow-hidden border border-border shadow-xl">
                    <Image
                        src={book.coverImageUrl}
                        alt={book.title} className="w-full h-full object-cover"
                        width={300}
                        height={400}
                    />
                </div>
                <div className="flex gap-2">
                    <Button className="flex-1 font-display tracking-wider text-sm" disabled={book.availableCopies === 0}>
                        {book.availableCopies > 0 ? "Solicitar Préstamo" : "Reservar"}
                    </Button>
                    <Button variant="outline" size="icon" aria-label="Añadir a wishlist"
                        onClick={() => handleWishlistToggle(book.id, book.isWishList)}
                    >
                        <Heart
                            className={`w-4 h-4 transition-colors ${book.isWishList
                                ? "text-red-500 fill-red-500"
                                : "text-muted-foreground hover:text-red-500"
                                }`}
                        />
                    </Button>
                </div>
            </div>
        </div>
    )
}
