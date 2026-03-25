'use client';

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewListSkeleton, BookSideSkeleton, BookMainInfoSkeleton } from "../custom/skeletons";
import { BookSide } from "./BookSide";
import { BookMain } from "./BookMain";
import { ReviewList } from "./ReviewList";
import type { checkoutProps, reserveBook, checkoutLoan, reserve } from "@/lib/definitions";
import { useState } from "react";
import { CheckoutBook } from "./CheckoutBook";
import { ReserveDialog } from "./ReserveDialog";
import { isBookInList } from "@/lib/booking-utils";
import { useReservation } from "@/hooks/queries/useReservation";
import { useLoans } from "@/hooks/queries/useLoans";
import { useBook } from "@/hooks/queries/useBook";
import { useLoanActions } from "@/hooks/mutations/useLoanActions";
import { useSubscription } from "@/hooks/queries/useSubscription";
import { useBookNavigation } from "@/hooks/ui/useBookNavigation";
import { useReservationActions } from "@/hooks/mutations/useReservationActions";

export const BookDetail = ({ id }: { id: string }) => {

  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [reserveDialogOpen, setReserveDialogOpen] = useState(false);
  const [checkoutDays, setCheckoutDays] = useState(14);
  const [actionNotes, setActionNotes] = useState("");

  const { data: book, isLoading: isBookLoading } = useBook(id);
  const { performCheckout, isPending } = useLoanActions(id);
  const { performReserve, isReserving } = useReservationActions(id);
  const { data: sub } = useSubscription();
  const { reservations } = useReservation();
  const { loans } = useLoans();
  const { handleBack } = useBookNavigation();

  const handleCheckout = () => {
    if (!book) return;
    const newLoan: checkoutLoan = {
      bookId: book.id,
      checkoutDays: checkoutDays,
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

  const hasLoan = isBookInList(loans?.content, book?.id);
  const hasRes = isBookInList(reservations?.content, book?.id);
  const hasSub = !!sub;

  const checkout: checkoutProps = {
    title: book?.title,
    maxDaysPerBook: sub?.maxDaysPerBook,
    checkoutDays,
    setCheckoutDays,
    actionNotes,
    setActionNotes,
    handleCheckout
  };

  const reserveBook: reserveBook = {
    bookId: book?.id,
    title: book?.title,
    actionNotes,
    setActionNotes,
    handleReserve
  };

  if (isBookLoading || !book) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={handleBack} className="mb-6 font-body gap-2">
          <ArrowLeft className="w-4 h-4" /> Volver
        </Button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <BookSideSkeleton />
          <div className="lg:col-span-2 space-y-8">
            <BookMainInfoSkeleton />
            <ReviewListSkeleton />
          </div>
        </div>
      </div>
    );
  }


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

          <ReviewList
            bookId={book.id}
          />

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
        isPending={isReserving} />

    </div>
  )

}