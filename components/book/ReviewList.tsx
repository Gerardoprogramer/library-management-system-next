
import { Users, Plus } from "lucide-react";
import { useCurrentUser } from "@/hooks/queries/useCurrentUser";
import { useReviews } from "@/hooks/queries/useReviews";
import { ReviewListSkeleton } from "../custom/skeletons";
import { CustomPagination } from "../custom/CustomPagination";
import { ReviewCard } from "../cards/ReviewCard";
import { Button } from "../ui/button";
import { useState } from "react";
import { ReviewFormDialog } from "../dialog/ReviewFormDialog";
import { useCreateReview } from "@/hooks/mutations/useCreateReview";

interface ReviewListProps {
    bookId: string;
    bookTitle: string;
    canCreate: boolean;
    alreadyReviewed: boolean;

}

export const ReviewList = ({ bookId, bookTitle, alreadyReviewed, canCreate }: ReviewListProps) => {


    const { data: user } = useCurrentUser();
    const { data: reviews, isLoading } = useReviews({ type: "book", id: bookId });
    const [dialogOpen, setDialogOpen] = useState(false);
    const { mutate: create } = useCreateReview({ type: "book", id: bookId });


    const handlesave = (formValues: { rating: number; title: string; reviewText: string }) => {
        create({ bookId: bookId, rating: formValues.rating, title: formValues.title, reviewText: formValues.reviewText });
        setDialogOpen(false);
    }

    if (isLoading) return <ReviewListSkeleton />

    const totalElements = reviews?.totalElements ?? 0;
    const content = reviews?.content ?? [];

    return (
        <div>
            <h2 className="font-display text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Reseñas
            </h2>
            {canCreate && (
                <Button size="sm" onClick={() => setDialogOpen(true)} className="font-body gap-1.5 mb-4">
                    <Plus className="w-4 h-4" /> Escribir reseña
                </Button>
            )}
            {alreadyReviewed && <p className="mb-4">Ya has calificado este libro</p>}
            {totalElements > 0 ? (
                <div className="space-y-4">
                    {content.map((review) => (
                        <ReviewCard key={review.id}
                            review={review} userId={user?.id}
                            bookTitle={bookTitle} bookId={bookId} />
                    ))}
                </div>
            ) : (
                <p className="font-body text-muted-foreground text-sm">Aún no hay reseñas para este libro.</p>
            )}


            {reviews && reviews.totalPages > 1 && (
                <div className="col-span-full mt-8">
                    <CustomPagination
                        totalPages={reviews.totalPages}
                        paramName="ReviewPage" />
                </div>
            )}

            <ReviewFormDialog
                mode="create"
                bookTitle={bookTitle}
                handleSave={handlesave}
                isOpen={dialogOpen}
                setIsOpen={setDialogOpen}
                isPending={false}
            />
        </div>
    )
}
