import { expect, test } from "@playwright/test";

test.describe("public and authentication flows", () => {
  test("shows the library landing page and exposes clear auth navigation", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Biblioteca Obsidian/);
    await expect(page.getByRole("link", { name: /iniciar sesión/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /crear cuenta|registr/i }).first()).toBeVisible();
  });

  test("allows users to reach registration and validates required fields accessibly", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.getByRole("link", { name: /crear cuenta/i })).toBeVisible();

    await page.getByRole("link", { name: /crear cuenta/i }).click();

    await expect(page).toHaveURL(/\/auth\/register$/);
    await expect(page.getByLabel("Nombre completo")).toBeVisible();
    await expect(page.getByLabel("Correo electrónico")).toBeVisible();
    await expect(page.getByRole("button", { name: /crear cuenta/i })).toBeVisible();

    await page.getByRole("button", { name: /crear cuenta/i }).click();

    await expect(page.getByLabel("Nombre completo")).toHaveAttribute("required", "");
    await expect(page.getByLabel("Correo electrónico")).toHaveAttribute("required", "");
  });

  test("redirects unauthenticated dashboard visitors to login", async ({ page }) => {
    await page.goto("/dashboard/admin");

    await expect(page).toHaveURL(/\/auth\/login\?reason=session_expired/);
  });

  test("returns authenticated users to the landing page after logout", async ({ page, context }) => {
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

    const emptyPage = {
      content: [],
      number: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
      last: true,
      first: true,
      empty: true,
    };

    await page.route("**/api/loans/me**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: emptyPage,
        }),
      });
    });

    await page.route("**/api/reservation/me**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: emptyPage,
        }),
      });
    });

    await page.route("**/api/wishlist**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: emptyPage,
        }),
      });
    });

    await page.route("**/api/subscription", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: null,
        }),
      });
    });

    await page.route("**/api/auth/logout", async (route) => {
      await route.fulfill({
        status: 200,
        headers: {
          "set-cookie": "access_token=; Max-Age=0; Path=/",
        },
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Sesión cerrada",
          data: null,
        }),
      });
    });

    await page.goto("/dashboard");

    await expect(page.getByRole("button", { name: "Cerrar sesión" })).toBeVisible();

    await page.getByRole("button", { name: "Cerrar sesión" }).click();

    await expect(page).toHaveURL("/", {
      timeout: 10_000,
    });

    await expect(page.getByRole("link", { name: /iniciar sesión/i }).first()).toBeVisible();
  });

  test("redirects authenticated non-admin users away from admin routes", async ({ page, context }) => {
    await context.addCookies([
      {
        name: "access_token",
        value: "e2e-access-token",
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

    await page.goto("/dashboard/admin");

    await expect(page).toHaveURL("/dashboard?reason=access_denied");
  });
});
