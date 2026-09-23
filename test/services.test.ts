import { beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@/lib/axios";
import { loansService } from "@/services/loansService";
import { reservationService } from "@/services/reservationService";

vi.mock("@/lib/axios", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
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
});
