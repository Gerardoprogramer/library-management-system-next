
import { Clock, Star, Users, Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useCurrentUser } from "@/hooks/queries/useCurrentUser";
import { formatDate } from "@/lib/date-utils"
import { useReviews } from "@/hooks/queries/useReviews";
import { ReviewListSkeleton } from "../custom/skeletons";
import { CustomPagination } from "../custom/CustomPagination";
interface ReviewListProps {
    bookId: string;
}

export const ReviewList = ({ bookId }: ReviewListProps) => {

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
                    {content.map((review) => {
                        const isOwn = user?.id === review.userId;
                        return (
                            <div key={review.id} className="bg-card border border-border rounded-lg p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-display text-sm font-semibold text-foreground">{review.userName}</span>
                                        {isOwn && <Badge variant="outline" className="text-[10px] px-1.5 py-0">Tú</Badge>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isOwn && (
                                            <>
                                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </>
                                        )}
                                        <div className="flex items-center gap-0.5">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-primary text-primary" : "text-muted"}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {review.title && (
                                    <p className="font-display text-sm font-medium text-foreground mb-1">{review.title}</p>
                                )}
                                <p className="font-body text-sm text-muted-foreground">{review.reviewText}</p>
                                <p className="font-body text-xs text-muted-foreground mt-2 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {formatDate(review.createdAt)}
                                </p>
                            </div>
                        );
                    })}
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
