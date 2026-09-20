import { useQuery } from "@tanstack/react-query";

import { loansService } from "@/services/loansService";
import { reservationService } from "@/services/reservationService";

async function hasLoanForBook(bookId: string, status: string) {
  let page = 0;

  while (true) {
    const loans = await loansService.getBookLoans(status, page);

    if (loans.content.some((loan) => loan.bookId === bookId)) {
      return true;
    }

    if (loans.last) {
      return false;
    }

    page += 1;
  }
}

export const useBookUserStatus = (bookId: string) => {
  return useQuery({
    queryKey: ["book-user-status", bookId],

    queryFn: async () => {
      const [hasCheckedOutLoan, hasOverdueLoan, reservations] = await Promise.all([
        hasLoanForBook(bookId, "CHECKED_OUT"),
        hasLoanForBook(bookId, "OVERDUE"),
        reservationService.getReservations(bookId, undefined, true, 0),
      ]);

      return {
        hasLoan: hasCheckedOutLoan || hasOverdueLoan,
        hasReservation: reservations.totalElements > 0,
      };
    },

    enabled: Boolean(bookId),
    staleTime: 1000 * 60 * 5,
  });
};
