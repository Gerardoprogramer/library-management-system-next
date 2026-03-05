
import { Clock, Star, Users } from "lucide-react";

interface ReviewListProps {
    reviews: {
        id: string;
        userName: string;
        rating: number;
        reviewText: string;
        createdAt: string;
    }[];
    totalElements: number;
}

export const ReviewList = ({ reviews, totalElements }: ReviewListProps) => {
    return (
        <div>
            <h2 className="font-display text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Reseñas
            </h2>
            {totalElements > 0 ? (
                <div className="space-y-4">
                    {reviews.map((review) => (
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
    )
}
