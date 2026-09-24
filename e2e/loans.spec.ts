import { expect, test } from "@playwright/test";

test.describe("loan flow", () => {
  test.beforeEach(async ({ context, page }) => {
    await context.addCookies([
      {
        name: "access_token",
        value: "e2e-access-token",
        url: "http://127.0.0.1:3100",
      },
      {
        name: "XSRF-TOKEN",
        value: "e2e-csrf",
        url: "http://127.0.0.1:3100",
      },
    ]);

    await page.route("**/api/users/me", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Usuario actual",
          data: {
            id: "user-1",
            email: "reader@example.com",
            fullName: "Reader",
            isAdmin: false,
            lastLogin: "",
          },
        }),
      });
    });

    await page.route("**/api/subscription", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Suscripción activa",
          data: {
            id: "subscription-1",
            userId: "user-1",
            subscriptionPlanId: "plan-1",
            planName: "Reader",
            planCode: "READER",
            price: 10,
            maxBooksAllowed: 5,
            maxDaysPerBook: 14,
            active: true,
            autoRenew: false,
            nextBillingDate: "2026-10-24",
            startDate: "2026-09-24",
            endDate: "2026-10-24",
            daysRemaining: 30,
            expired: false,
            cancelledAt: "",
            cancellationReason: "",
            notes: "",
            createdAt: "2026-09-24T12:00:00",
            updatedAt: "2026-09-24T12:00:00",
          },
        }),
      });
    });
  });

  test("allows returning an active loan", async ({ page }) => {
    let returned = false;

    const activeLoan = {
      id: "loan-1",
      bookId: "book-1",
      bookTitle: "Clean Code",
      author: "Robert C. Martin",
      bookCoverImageUrl: "/library-hero.jpg",
      userId: "user-1",
      userName: "Reader",
      type: "CHECKOUT",
      status: "CHECKED_OUT",
      checkoutDate: "2026-09-20T12:00:00",
      dueDate: "2026-10-04T12:00:00",
      remainingDays: 10,
      returnDate: "",
      renewalCount: 0,
      maxRenewals: 2,
      notes: "",
      overdue: false,
      overdueDays: 0,
      fineAmount: 0,
    };

    const returnedLoan = {
      ...activeLoan,
      type: "RETURN",
      status: "RETURNED",
      remainingDays: 0,
      returnDate: "2026-09-24T12:00:00",
    };

    await page.route("**/api/loans/me**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Préstamos obtenidos",
          data: {
            content: [returned ? returnedLoan : activeLoan],
            number: 0,
            size: 10,
            totalElements: 1,
            totalPages: 1,
            last: true,
            first: true,
            empty: false,
          },
        }),
      });
    });

    await page.route("**/api/loans/checkin", async (route) => {
      returned = true;

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Libro devuelto correctamente",
          data: returnedLoan,
        }),
      });
    });

    await page.goto("/dashboard/loans");

    await expect(
      page.getByRole("heading", {
        name: "Mis préstamos",
      })
    ).toBeVisible();

    await expect(page.getByText("Clean Code")).toBeVisible();

    const returnButton = page.getByRole("button", {
      name: "Devolver libro",
    });

    await expect(returnButton).toBeVisible();

    const checkinRequestPromise = page.waitForRequest(
      (request) => request.url().includes("/api/loans/checkin") && request.method() === "POST"
    );

    await returnButton.click();

    const checkinRequest = await checkinRequestPromise;

    expect(checkinRequest.postDataJSON()).toEqual({
      loanId: "loan-1",
      status: "RETURNED",
    });

    await expect(returnButton).not.toBeVisible();

    await expect(page.getByText("Devuelto").first()).toBeVisible();
  });
});
