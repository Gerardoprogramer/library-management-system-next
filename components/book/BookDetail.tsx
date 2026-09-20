"use client";

import { useState } from "react";
import { PiArrowLeft } from "react-icons/pi";

import { BookMain } from "@/components/book/BookMain";
import { BookSide } from "@/components/book/BookSide";
import { ReviewList } from "@/components/book/ReviewList";
import { BookMainInfoSkeleton, BookSideSkeleton, ReviewListSkeleton } from "@/components/custom/skeletons";
import { CheckoutBook } from "@/components/dialog/CheckoutBook";
import { ReserveDialog } from "@/components/dialog/ReserveDialog";
import { Button } from "@/components/ui/button";
import { useLoanActions } from "@/hooks/mutations/useLoanActions";
import { useReservationActions } from "@/hooks/mutations/useReservationActions";
import { useBook } from "@/hooks/queries/useBook";
import { useBookUserStatus } from "@/hooks/queries/useBookUserStatus";
import { useSubscription } from "@/hooks/queries/useSubscription";
import { useBookNavigation } from "@/hooks/ui/useBookNavigation";
import type { checkoutLoan, checkoutProps, reserve, reserveBook } from "@/lib/definitions";

export const BookDetail = ({ id }: { id: string }) => {
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [reserveDialogOpen, setReserveDialogOpen] = useState(false);
  const [checkoutDays, setCheckoutDays] = useState(14);
  const [actionNotes, setActionNotes] = useState("");

  const { data: book, isLoading: isBookLoading } = useBook(id);
  const { data: subscription, isLoading: isSubscriptionLoading } = useSubscription();
  const { data: bookUserStatus, isLoading: isStatusLoading } = useBookUserStatus(id);

  const { performCheckout, isPending } = useLoanActions(id);
  const { performReserve, isReserving } = useReservationActions(id);
  const { handleBack } = useBookNavigation();

  const hasLoan = bookUserStatus?.hasLoan ?? false;
  const hasRes = bookUserStatus?.hasReservation ?? false;
  const hasSub = Boolean(subscription?.active && !subscription.expired);

  const handleCheckout = () => {
    if (!book) return;

    const newLoan: checkoutLoan = {
      bookId: book.id,
      checkoutDays,
      notes: actionNotes.trim() || undefined,
    };

    performCheckout(newLoan);
    setCheckoutDialogOpen(false);
    setActionNotes("");
  };

  const handleReserve = () => {
    if (!book) return;

    const newReserve: reserve = {
      bookId: book.id,
      notes: actionNotes.trim() || undefined,
    };

    performReserve(newReserve);
    setReserveDialogOpen(false);
    setActionNotes("");
  };

  const checkout: checkoutProps = {
    title: book?.title,
    maxDaysPerBook: subscription?.maxDaysPerBook,
    checkoutDays,
    setCheckoutDays,
    actionNotes,
    setActionNotes,
    handleCheckout,
  };

  const reserveBook: reserveBook = {
    bookId: book?.id,
    title: book?.title,
    actionNotes,
    setActionNotes,
    handleReserve,
  };

  const isLoading = isBookLoading || isSubscriptionLoading || isStatusLoading;

  if (isLoading || !book) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={handleBack} className="gap-2 rounded-xl">
          <PiArrowLeft className="size-4" />
          Volver
        </Button>

        <div className="grid gap-8 lg:grid-cols-[minmax(260px,360px)_minmax(0,1fr)] lg:items-start">
          <BookSideSkeleton />

          <div className="space-y-8">
            <BookMainInfoSkeleton />
            <ReviewListSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={handleBack} className="gap-2 rounded-xl">
        <PiArrowLeft className="size-4" />
        Volver al catálogo
      </Button>

      <div className="grid gap-8 lg:grid-cols-[minmax(260px,360px)_minmax(0,1fr)] lg:items-start">
        <BookSide
          book={book}
          setCheckoutDialogOpen={setCheckoutDialogOpen}
          setReserveDialogOpen={setReserveDialogOpen}
          hasLoan={hasLoan}
          hasRes={hasRes}
          hasSub={hasSub}
        />

        <div className="min-w-0 space-y-10">
          <BookMain book={book} />

          <section className="border-t border-border/70 pt-8">
            <ReviewList
              bookId={book.id}
              bookTitle={book.title}
              alreadyReviewed={book.alreadyReviewed}
              canCreate={book.canReview}
            />
          </section>
        </div>
      </div>

      <CheckoutBook
        checkout={checkout}
        checkoutDialogOpen={checkoutDialogOpen}
        setCheckoutDialogOpen={setCheckoutDialogOpen}
        isPending={isPending}
      />

      <ReserveDialog
        reserve={reserveBook}
        reserveDialogOpen={reserveDialogOpen}
        setReserveDialogOpen={setReserveDialogOpen}
        isPending={isReserving}
      />
    </div>
  );
};
