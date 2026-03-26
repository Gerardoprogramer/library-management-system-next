
import { Users } from "lucide-react";
import { useCurrentUser } from "@/hooks/queries/useCurrentUser";
import { useReviews } from "@/hooks/queries/useReviews";
import { ReviewListSkeleton } from "../custom/skeletons";
import { CustomPagination } from "../custom/CustomPagination";
import { ReviewCard } from "../cards/ReviewCard";
interface ReviewListProps {
    bookId: string;
    bookTitle: string;
    oldRating: number
}

export const ReviewList = ({ bookId, bookTitle, oldRating }: ReviewListProps) => {


    const { data: user } = useCurrentUser();
    const { data: reviews, isLoading } = useReviews({ type: "book", id: bookId });


    if (isLoading) return <ReviewListSkeleton />

    const totalElements = reviews?.totalElements ?? 0;
    const content = reviews?.content ?? [];

    return (
        <div>
            <h2 className="font-display text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Reseñas
            </h2>
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

        </div>
    )
}
