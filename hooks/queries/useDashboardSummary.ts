import { useQueries } from "@tanstack/react-query";

import { loansService } from "@/services/loansService";
import { reservationService } from "@/services/reservationService";
import { SubscriptionService } from "@/services/SubscriptionService";
import { WishListService } from "@/services/wishlistService";

export const useDashboardSummary = () => {
  const [
    activeLoansQuery,
    overdueLoansQuery,
    pendingReservationsQuery,
    availableReservationsQuery,
    wishlistQuery,
    subscriptionQuery,
  ] = useQueries({
    queries: [
      {
        queryKey: ["dashboard", "loans", "CHECKED_OUT"],
        queryFn: () => loansService.getBookLoans("CHECKED_OUT", 0),
        staleTime: 1000 * 60 * 5,
      },
      {
        queryKey: ["dashboard", "loans", "OVERDUE"],
        queryFn: () => loansService.getBookLoans("OVERDUE", 0),
        staleTime: 1000 * 60 * 5,
      },
      {
        queryKey: ["dashboard", "reservations", "PENDING"],
        queryFn: () => reservationService.getReservations(undefined, "PENDING", undefined, 0),
        staleTime: 1000 * 60 * 5,
      },
      {
        queryKey: ["dashboard", "reservations", "AVAILABLE"],
        queryFn: () => reservationService.getReservations(undefined, "AVAILABLE", undefined, 0),
        staleTime: 1000 * 60 * 5,
      },
      {
        queryKey: ["dashboard", "wishlist"],
        queryFn: () => WishListService.getMyWishlist(0),
        staleTime: 1000 * 60 * 5,
      },
      {
        queryKey: ["dashboard", "subscription"],
        queryFn: () => SubscriptionService.subscription(),
        staleTime: 1000 * 60 * 5,
        retry: false,
      },
    ],
  });

  const activeLoans = activeLoansQuery.data?.totalElements ?? 0;
  const overdueLoans = overdueLoansQuery.data?.totalElements ?? 0;

  const pendingReservations = pendingReservationsQuery.data?.totalElements ?? 0;
  const availableReservations = availableReservationsQuery.data?.totalElements ?? 0;
  const activeReservations = pendingReservations + availableReservations;

  const wishlistBooks = wishlistQuery.data?.totalElements ?? 0;
  const subscription = subscriptionQuery.data ?? null;

  const isLoading = [
    activeLoansQuery,
    overdueLoansQuery,
    pendingReservationsQuery,
    availableReservationsQuery,
    wishlistQuery,
    subscriptionQuery,
  ].some((query) => query.isPending);

  return {
    activeLoans,
    overdueLoans,
    activeReservations,
    availableReservations,
    wishlistBooks,
    subscription,
    isLoading,
  };
};
