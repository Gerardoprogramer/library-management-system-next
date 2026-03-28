'use client'

import { useReviews } from "@/hooks/queries/useReviews";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { MeReviewCard } from "@/components/cards/MeReviewCard";

export default function ReviewPage() {

  const { data: reviews } = useReviews({ type: "mine" });

  return (<div>
    <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground mb-2">Mis Reseñas</h1>
    <p className="font-body text-lg text-muted-foreground mb-8">{reviews?.totalElements} reseñas publicadas</p>

    <div className="space-y-4">
      {reviews?.content.map((review) => (
        <MeReviewCard key={review.id} review={review} />
      ))}
      {reviews?.totalElements === 0 && (
        <p className="font-body text-muted-foreground text-center py-8">No has publicado ninguna reseña aún.</p>
      )}
    </div>
    {reviews && reviews.totalPages > 1 && (
      <div className="px-4 mt-6">
        <CustomPagination totalPages={reviews?.totalPages} paramName="ReviewPage" />
      </div>
    )}
  </div>);
}