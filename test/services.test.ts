import { beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@/lib/axios";
import { loansService } from "@/services/loansService";
import { reservationService } from "@/services/reservationService";

vi.mock("@/lib/axios", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("domain services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses the BFF loan route and preserves the renewed loan response", async () => {
    const renewedLoan = { id: "loan-1", status: "CHECKED_OUT" };
    vi.mocked(api.post).mockResolvedValueOnce({
      data: { success: true, message: "Préstamo renovado", data: renewedLoan },
    });

    const response = await loansService.renew({ loanId: "loan-1", extensionDays: 7 });

    expect(api.post).toHaveBeenCalledWith("/loans/renew", { loanId: "loan-1", extensionDays: 7 });
    expect(response.data).toEqual(renewedLoan);
  });

  it("maps reservation queue requests through the reservation BFF route", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: { success: true, message: "Cola obtenida", data: 3 },
    });

    await expect(reservationService.getQueue("book-1")).resolves.toBe(3);
    expect(api.get).toHaveBeenCalledWith("/reservation/book-1");
  });

  it("returns a stable empty page when the reservations endpoint has no data", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: { success: true, message: "Sin reservas", data: null },
    });

    await expect(reservationService.getReservations()).resolves.toMatchObject({
      content: [],
      totalElements: 0,
      totalPages: 0,
      empty: true,
    });
  });

  it("sends the complete checkout payload", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: { success: true, message: "Préstamo creado", data: null },
    });

    await loansService.checkout({ bookId: "book-1", checkoutDays: 14, notes: "Para investigación" });

    expect(api.post).toHaveBeenCalledWith("/loans/checkout", {
      bookId: "book-1",
      checkoutDays: 14,
      notes: "Para investigación",
    });
  });

  it("maps check-in and cancellation mutations to their BFF routes", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: { success: true, message: "Libro devuelto", data: { id: "loan-1" } },
    });
    vi.mocked(api.delete).mockResolvedValueOnce({
      data: { success: true, message: "Reserva cancelada", data: { id: "reservation-1" } },
    });

    await loansService.checkin({ loanId: "loan-1", notes: "Devuelto en mostrador" });
    await reservationService.cancel("reservation-1");

    expect(api.post).toHaveBeenCalledWith("/loans/checkin", {
      loanId: "loan-1",
      notes: "Devuelto en mostrador",
    });
    expect(api.delete).toHaveBeenCalledWith("/reservation/reservation-1");
  });

  it("starts fine payments and rejects responses without a checkout URL", async () => {
    const payment = { checkoutUrl: "https://checkout.stripe.com/session-1", paymentId: "payment-1" };
    vi.mocked(api.post).mockResolvedValueOnce({
      data: { success: true, message: "Pago iniciado", data: payment },
    });

    await expect((await import("@/services/fineService")).FineService.pay("fine-1")).resolves.toEqual(payment);
    expect(api.post).toHaveBeenCalledWith("/fines/fine-1/pay");

    vi.mocked(api.post).mockResolvedValueOnce({
      data: { success: false, message: "No disponible", data: null },
    });

    await expect((await import("@/services/fineService")).FineService.pay("fine-2")).rejects.toThrow("No disponible");
  });

  it("creates subscriptions with the selected plan and billing options", async () => {
    const subscription = { checkoutUrl: "https://checkout.stripe.com/session-2", subscriptionId: "sub-1" };
    vi.mocked(api.post).mockResolvedValueOnce({
      data: { success: true, message: "Suscripción creada", data: subscription },
    });

    await expect(
      (await import("@/services/subscriptionService")).SubscriptionService.subscribeToPlan(
        "plan-1",
        true,
        "Suscripción anual"
      )
    ).resolves.toEqual(subscription);

    expect(api.post).toHaveBeenCalledWith("/subscription", {
      subscriptionPlanId: "plan-1",
      autoRenew: true,
      notes: "Suscripción anual",
    });
  });
});
