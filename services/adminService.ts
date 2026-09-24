import { api } from "@/lib/axios";
import type {
  AdminBookInput,
  AdminCheckoutInput,
  AdminFineInput,
  AdminGenreInput,
  AdminLoanSearch,
  AdminReservationSearch,
  AdminSubscriptionPlanInput,
  ApiResponse,
  BookDetail,
  Fine,
  Genre,
  meLoans,
  PageResponse,
  Payment,
  reservationBook,
  Subscription,
  SubscriptionPlan,
  User,
} from "@/lib/definitions";

const adminRequest = async <T>(request: Promise<{ data: ApiResponse<T> }>): Promise<T> => {
  const response = await request;

  if (!response.data.success) {
    throw new Error(response.data.message || "La operación administrativa no pudo completarse");
  }

  if (response.data.data === null) {
    throw new Error(response.data.message || "La operación administrativa no devolvió datos");
  }

  return response.data.data;
};

const adminVoidRequest = async (request: Promise<{ data: ApiResponse<unknown> }>): Promise<void> => {
  const response = await request;

  if (!response.data.success) {
    throw new Error(response.data.message || "La operación administrativa no pudo completarse");
  }
};

export const adminService = {
  users: () => adminRequest<User[]>(api.get("/admin/users")),

  createBook: (book: AdminBookInput) => adminRequest<BookDetail>(api.post("/admin/books", book)),
  bulkCreateBooks: (books: AdminBookInput[]) => adminRequest<BookDetail[]>(api.post("/admin/books/bulk", books)),
  updateBook: (id: string, book: AdminBookInput) => adminRequest<BookDetail>(api.put(`/admin/books/${id}`, book)),
  deleteBook: (id: string, hard = false) => adminVoidRequest(api.delete(`/admin/books/${id}${hard ? "/hard" : ""}`)),

  createGenre: (genre: AdminGenreInput) => adminRequest<Genre>(api.post("/admin/genres", genre)),
  updateGenre: (id: string, genre: AdminGenreInput) => adminRequest<Genre>(api.put(`/admin/genres/${id}`, genre)),
  deleteGenre: (id: string, hard = false) => adminVoidRequest(api.delete(`/admin/genres/${id}${hard ? "/hard" : ""}`)),

  createSubscriptionPlan: (plan: AdminSubscriptionPlanInput) =>
    adminRequest<SubscriptionPlan>(api.post("/admin/subscription-plans", plan)),
  updateSubscriptionPlan: (id: string, plan: AdminSubscriptionPlanInput) =>
    adminRequest<SubscriptionPlan>(api.put(`/admin/subscription-plans/${id}`, plan)),
  deleteSubscriptionPlan: (id: string) => adminVoidRequest(api.delete(`/admin/subscription-plans/${id}`)),

  subscriptions: (params?: Record<string, string | number | boolean>) =>
    adminRequest<PageResponse<Subscription>>(api.get("/admin/subscriptions", { params })),
  deactivateExpiredSubscriptions: () => adminVoidRequest(api.post("/admin/subscriptions/deactivate-expired")),

  fines: (params?: Record<string, string | number>) =>
    adminRequest<PageResponse<Fine>>(api.get("/admin/fines", { params })),
  createFine: (fine: AdminFineInput) => adminRequest<Fine>(api.post("/admin/fines", fine)),
  waiveFine: (fine: Pick<AdminFineInput, "fineId" | "reason">) =>
    adminRequest<Fine>(api.post("/admin/fines/waive", fine)),

  searchLoans: (search: AdminLoanSearch) =>
    adminRequest<PageResponse<meLoans>>(api.post("/admin/book-loans/search", search)),
  checkoutForUser: (userId: string, loan: AdminCheckoutInput) =>
    adminRequest<meLoans>(api.post(`/admin/book-loans/users/${userId}/checkout`, loan)),
  updateOverdueLoans: () => adminRequest<number>(api.put("/admin/book-loans/overdue/update")),

  reservations: (params?: AdminReservationSearch) =>
    adminRequest<PageResponse<reservationBook>>(api.get("/admin/reservations", { params })),
  createReservationForUser: (userId: string, reservation: Record<string, unknown>) =>
    adminRequest<reservationBook>(api.post(`/admin/reservations/user/${userId}`, reservation)),
  fulfillReservation: (id: string, checkoutDays: number) =>
    adminRequest<reservationBook>(
      api.post(`/admin/reservations/${id}/fulfill`, undefined, { params: { checkoutDays } })
    ),

  refundPayment: (paymentId: string, payload?: Record<string, unknown>) =>
    adminRequest<Payment>(api.post(`/admin/payments/${paymentId}/refund`, payload)),
};
