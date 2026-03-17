'use client';

import { bookService } from "@/services/bookService";
import { useQuery } from "@tanstack/react-query";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reviewService } from "@/services/reviewService";
import { useRouter, useSearchParams } from "next/navigation";
import { ReviewListSkeleton, BookSideSkeleton, BookMainInfoSkeleton } from "../custom/skeletons";
import { useWishlist } from "@/hooks/useWishlist";
import { CustomPagination } from "@/components/custom/CustomPagination";
import type { BookDetail as Book } from "@/lib/definitions";
import { BookSide } from "./BookSide";
import { BookMain } from "./BookMain";
import { ReviewList } from "./ReviewList";

export const BookDetail = ({ id }: { id: string }) => {

  const router = useRouter();
  const searchParams = useSearchParams();

  const queryPage = searchParams.get("ReviewPage") ?? "1";
  const { handleWishlistToggle, isLoading: isWishlistLoading } = useWishlist();

  const handleBack = () => {
    const from = searchParams.get("from");

    if (from) {
      router.push(decodeURIComponent(from));
    } else {
      router.push("/dashboard/catalog");
    }
  };

  const { data: book, isLoading: isBookLoading } = useQuery<Book>({
    queryKey: ["book", id],
    queryFn: () => bookService.book(id),
    placeholderData: (prev) => prev,
    enabled: !!id,
  });

  const { data: reviews, isLoading: isReviewsLoading } = useQuery({
    queryKey: ["reviews", id, queryPage],
    queryFn: () =>
      reviewService.getBookReviews(
        id,
        isNaN(+queryPage) ? 0 : +queryPage - 1
      ),
    placeholderData: (prev) => prev,
    enabled: !!id,
  });


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

