'use client';

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewListSkeleton, BookSideSkeleton, BookMainInfoSkeleton } from "../custom/skeletons";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { BookSide } from "./BookSide";
import { BookMain } from "./BookMain";
import { ReviewList } from "./ReviewList";
import { useBookDetail } from "@/hooks/useBookDetail";

export const BookDetail = ({ id }: { id: string }) => {

  const {
    handleBack,
    handleWishlistToggle,
    isWishlistLoading,
    bookQuery,
    reviewsQuery,
  } = useBookDetail(id);

  const { data: book, isLoading: isBookLoading } = bookQuery;
  const { data: reviews, isLoading: isReviewsLoading } = reviewsQuery;



  return (
    <div>
      <Button variant="ghost" onClick={handleBack} className="mb-6 font-body gap-2">
        <ArrowLeft className="w-4 h-4" /> Volver
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {isBookLoading || !book ? (
          <BookSideSkeleton />
        ) : (
          <BookSide
            book={book}
            handleWishlistToggle={handleWishlistToggle}
            isWishlistLoading={isWishlistLoading} />
        )}

        <div className="lg:col-span-2 space-y-8">

          {isBookLoading || !book ? (
            <BookMainInfoSkeleton />
          ) : (
            <BookMain book={book} />
          )}

          {isReviewsLoading ? (
            <ReviewListSkeleton />
          ) : (
            <ReviewList
              reviews={reviews ? reviews.content : []}
              totalElements={reviews ? reviews.totalElements : 0} />
          )}
          {reviews && reviews.totalPages > 1 && (
            <div className="col-span-full mt-8">
              <CustomPagination
                totalPages={reviews.totalPages}
                paramName="ReviewPage" />
            </div>
          )}
        </div>
      </div>
    </div>
  )

}

