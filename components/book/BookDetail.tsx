'use client';

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewListSkeleton, BookSideSkeleton, BookMainInfoSkeleton } from "../custom/skeletons";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { BookSide } from "./BookSide";
import { BookMain } from "./BookMain";
import { ReviewList } from "./ReviewList";
import { useBookDetail } from "@/hooks/useBookDetail";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { checkoutProps, reserveBook, Subscription } from "@/lib/definitions";
import { useQuery } from "@tanstack/react-query";
import { SubscriptionService } from "@/services/SubscriptionService";
import { useState } from "react";
import { checkoutLoan } from "@/lib/definitions";
import { CheckoutBook } from "./CheckoutBook";
import { ReserveDialog } from "./ReserveDialog";
import { isBookInList } from "@/lib/booking-utils";
import { useReservation } from "@/hooks/useReservation";
import { useLoans } from "@/hooks/useLoans";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loansService } from "@/services/loansService";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast-utils";

export const BookDetail = ({ id }: { id: string }) => {
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [reserveDialogOpen, setReserveDialogOpen] = useState(false);
  const [checkoutDays, setCheckoutDays] = useState(14);
  const [actionNotes, setActionNotes] = useState("");


  const {
    handleBack,
    handleWishlistToggle,
    bookQuery,
    reviewsQuery,
  } = useBookDetail(id);

  const { data: book, isLoading: isBookLoading } = bookQuery;
  const { data: reviews, isLoading: isReviewsLoading } = reviewsQuery;

  const debouncedToggle = useDebouncedCallback(
    (bookId: string, isInWishlist: boolean) => {
      handleWishlistToggle(bookId, isInWishlist);
    },
    300
  );
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: performCheckout, isPending } = useMutation({
    mutationFn: (newLoan: checkoutLoan) => loansService.checkout(newLoan),

    onSuccess: (response) => {
      showToast.success("¡Préstamo exitoso!", response.message, {
        label: "Mis Libros",
        onClick: () => router.push("/dashboard/loans"),
      });

      queryClient.invalidateQueries({ queryKey: ["loans"] });
      queryClient.invalidateQueries({ queryKey: ["book", id] });

      setCheckoutDialogOpen(false);
      setActionNotes("");
    },
    onError: (error) => {
      showToast.apiError(error);
    }
  });

  const handleCheckout = () => {
    const newLoan: checkoutLoan = {
      bookId: book?.id,
      checkoutDays: checkoutDays,
      notes: actionNotes.trim() || undefined,
    };

    performCheckout(newLoan);
  };


  const { data: sub } = useQuery<Subscription>({
    queryKey: ["subscription"],
    queryFn: () => SubscriptionService.subscription(),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  });


  const handleReserve = () => {

  }

  const checkout: checkoutProps = {
    title: book?.title,
    maxDaysPerBook: sub?.maxDaysPerBook,
    checkoutDays: checkoutDays,
    setCheckoutDays: setCheckoutDays,
    actionNotes: actionNotes,
    setActionNotes: setActionNotes,
    handleCheckout: handleCheckout
  }

  const reserve: reserveBook = {
    bookId: book?.id,
    title: book?.title,
    actionNotes: actionNotes,
    setActionNotes: setActionNotes,
    handleReserve: handleReserve
  }


  const { reservations } = useReservation();
  const { loans } = useLoans();

  const hasLoan = isBookInList(loans?.content, book?.id);
  const hasRes = isBookInList(reservations?.content, book?.id);
  const hasSub = sub ? true : false


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
            handleWishlistToggle={debouncedToggle}
            setCheckoutDialogOpen={setCheckoutDialogOpen}
            setReserveDialogOpen={setReserveDialogOpen}
            hasLoan={hasLoan}
            hasRes={hasRes}
            hasSub={hasSub}
          />
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

      <CheckoutBook
        checkout={checkout}
        checkoutDialogOpen={checkoutDialogOpen}
        setCheckoutDialogOpen={setCheckoutDialogOpen}
        isPending={isPending}
      />

      <ReserveDialog
        reserve={reserve}
        reserveDialogOpen={reserveDialogOpen}
        setReserveDialogOpen={setReserveDialogOpen} />

    </div>
  )

}

