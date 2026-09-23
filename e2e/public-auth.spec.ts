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
});
