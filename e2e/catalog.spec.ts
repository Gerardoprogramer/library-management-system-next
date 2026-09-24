import { expect, test } from "@playwright/test";

test.describe("catalog flow", () => {
  test.beforeEach(async ({ context, page }) => {
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

    await page.route("**/api/genres", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Géneros obtenidos",
          data: [
            {
              id: "genre-1",
              code: "FICTION",
              name: "Ficción",
              description: "",
              displayOrder: 1,
              active: true,
              parentGenreId: null,
            },
          ],
        }),
      });
    });

    await page.route("**/api/book/search**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Libros encontrados",
          data: {
            content: [
              {
                id: "book-1",
                title: "Clean Code",
                author: "Robert C. Martin",
                genreName: "Ficción",
                pages: 464,
                availableCopies: 3,
                coverImageUrl: "/library-hero.jpg",
                isWishList: false,
                averageRating: 4.5,
                totalReviews: 10,
              },
            ],
            number: 0,
            size: 8,
            totalElements: 1,
            totalPages: 1,
            last: true,
            first: true,
            empty: false,
          },
        }),
      });
    });
  });

  test("shows books and allows searching the catalog", async ({ page }) => {
    await page.goto("/dashboard/catalog");

    await expect(
      page.getByRole("heading", {
        name: "Encontrá tu próxima lectura",
      })
    ).toBeVisible();

    await expect(page.getByText("Clean Code")).toBeVisible();
    await expect(page.getByText("Robert C. Martin")).toBeVisible();
    await expect(page.getByText("3 disponibles")).toBeVisible();

    const search = page.getByPlaceholder("Buscar por título, autor o ISBN...");

    await search.fill("Clean Code");

    await expect(page).toHaveURL(/searchTerm=Clean\+Code/);
  });
});
