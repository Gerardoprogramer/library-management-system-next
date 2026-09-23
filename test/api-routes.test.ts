import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { backendProxy } from "@/lib/api-proxy";
import { POST as login } from "@/app/api/auth/login/route";
import { POST as renew } from "@/app/api/loans/renew/route";
import { POST as fulfillReservation } from "@/app/api/admin/reservations/[id]/fulfill/route";
import { POST as checkoutForUser } from "@/app/api/admin/book-loans/users/[userId]/checkout/route";
import { GET as paymentStatus } from "@/app/api/payment/[id]/status/route";

vi.mock("@/lib/api-proxy", () => ({
  backendProxy: vi.fn(),
}));

const proxyResponse = NextResponse.json({ success: true });

const request = (url: string, init?: ConstructorParameters<typeof NextRequest>[1]) => new NextRequest(url, init);

describe("BFF API route contracts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(backendProxy).mockResolvedValue(proxyResponse);
  });

  it("forwards login payloads through the auth endpoint", async () => {
    const loginRequest = request("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "reader@example.com", password: "secret" }),
      headers: { "content-type": "application/json" },
    });

    await login(loginRequest);

    expect(backendProxy).toHaveBeenCalledWith(
      loginRequest,
      "/auth/login",
      expect.objectContaining({ method: "POST", body: { email: "reader@example.com", password: "secret" } })
    );
  });

  it("maps loan renewal to the backend book-loans endpoint", async () => {
    const renewRequest = request("http://localhost/api/loans/renew", { method: "POST" });

    await renew(renewRequest);

    expect(backendProxy).toHaveBeenCalledWith(renewRequest, "/book-loans/renew");
  });

  it("preserves the reservation id and checkout query parameters", async () => {
    const fulfillRequest = request("http://localhost/api/admin/reservations/reservation-1/fulfill?checkoutDays=14", {
      method: "POST",
    });

    await fulfillReservation(fulfillRequest, { params: Promise.resolve({ id: "reservation-1" }) });

    expect(backendProxy).toHaveBeenCalledWith(fulfillRequest, "/admin/reservations/reservation-1/fulfill");
  });

  it("maps an administrative checkout to the selected user", async () => {
    const checkoutRequest = request("http://localhost/api/admin/book-loans/users/user-1/checkout", {
      method: "POST",
    });

    await checkoutForUser(checkoutRequest, { params: Promise.resolve({ userId: "user-1" }) });

    expect(backendProxy).toHaveBeenCalledWith(checkoutRequest, "/admin/book-loans/users/user-1/checkout");
  });

  it("translates payment status ids to the plural backend resource", async () => {
    const paymentRequest = request("http://localhost/api/payment/payment-1/status");

    await paymentStatus(paymentRequest, { params: Promise.resolve({ id: "payment-1" }) });

    expect(backendProxy).toHaveBeenCalledWith(paymentRequest, "/payments/payment-1/status");
  });
});
