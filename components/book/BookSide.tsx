
import Image from "next/image";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "@/components/ui/button";
import { Heart, CalendarClock, BookMarked, AlertCircle } from "lucide-react";
import { useWishlistActions } from "@/hooks/mutations/useWishlistActions";
import { useDebouncedCallback } from "@/hooks/Utilidades/useDebouncedCallback";

interface BookSideProps {
    book: {
        id: string;
        title: string;
        coverImageUrl: string;
        availableCopies: number;
        isWishList: boolean;
    };
    setCheckoutDialogOpen: (Open: boolean) => void;
    setReserveDialogOpen: (Open: boolean) => void;
    hasSub: boolean;
    hasRes: boolean;
    hasLoan: boolean;
}
export const BookSide = ({ book, setCheckoutDialogOpen, setReserveDialogOpen,
    hasRes, hasSub, hasLoan
}: BookSideProps) => {

    const { mutate: toggleWishlist } = useWishlistActions();

    const debouncedToggle = useDebouncedCallback(
        (bookId: string, isInWishlist: boolean) => {
            toggleWishlist({ bookId, isInWishlist });
        },
        300
    );

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
                    {book.availableCopies > 0 || hasLoan ? (
                        <Button
                            className="flex-1 font-display tracking-wider text-sm gap-2"
                            disabled={!hasSub || hasLoan}
                            onClick={() => setCheckoutDialogOpen(true)}
                        >
                            <BookMarked className="w-4 h-4" /> Solicitar Préstamo
                        </Button>
                    ) : (
                        <Button
                            className="flex-1 font-display tracking-wider text-sm gap-2"
                            variant="secondary"
                            disabled={!hasSub || hasRes}
                            onClick={() => setReserveDialogOpen(true)}
                        >
                            <CalendarClock className="w-4 h-4" /> Reservar
                        </Button>
                    )}
                    <Button variant="outline" size="icon" aria-label="Añadir a wishlist"
                        onClick={() => debouncedToggle(book.id, book.isWishList)}
                    >
                        <Heart
                            className={`w-4 h-4 transition-colors ${book.isWishList
                                ? "text-red-500 fill-red-500"
                                : "text-muted-foreground hover:text-red-500"
                                }`}
                        />
                    </Button>
                </div>
                {!hasSub && (
                    <Alert className="py-2 px-3">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="font-body text-xs">
                            Necesitas una suscripción activa para solicitar préstamos o reservas.
                        </AlertDescription>
                    </Alert>
                )}
                {hasLoan && (
                    <p className="font-body text-xs text-muted-foreground text-center">Ya tienes un préstamo activo de este libro.</p>
                )}
                {hasRes && book.availableCopies === 0 && (
                    <p className="font-body text-xs text-muted-foreground text-center">Ya tienes una reserva activa para este libro.</p>
                )}
            </div>
        </div>
    )
}
