import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { User } from "@/lib/definitions";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { useCurrentUser } from "@/hooks/queries/useCurrentUser";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard/admin/libros",
  useRouter: () => ({ replace }),
}));

vi.mock("@/hooks/queries/useCurrentUser", () => ({
  useCurrentUser: vi.fn(),
}));

const queryResult = (overrides: Partial<ReturnType<typeof useCurrentUser>>) =>
  ({
    data: undefined,
    error: null,
    isError: false,
    isLoading: false,
    isPending: false,
    isSuccess: false,
    status: "pending",
    ...overrides,
  }) as ReturnType<typeof useCurrentUser>;

describe("AdminGuard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a permission check while the current user is loading", () => {
    vi.mocked(useCurrentUser).mockReturnValue(queryResult({ isLoading: true, isPending: true }));

    render(
      <AdminGuard>
        <p>Contenido administrativo</p>
      </AdminGuard>
    );

    expect(screen.getByText("Verificando permisos")).toBeInTheDocument();
    expect(screen.queryByText("Contenido administrativo")).not.toBeInTheDocument();
  });

  it("renders administrative content for an administrator", () => {
    const user: User = {
      id: "admin-1",
      email: "admin@example.com",
      fullName: "Admin",
      isAdmin: true,
      lastLogin: "",
    };
    vi.mocked(useCurrentUser).mockReturnValue(queryResult({ data: user, isSuccess: true, status: "success" }));

    render(
      <AdminGuard>
        <p>Contenido administrativo</p>
      </AdminGuard>
    );

    expect(screen.getByText("Contenido administrativo")).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("redirects unauthenticated users to login with their callback URL", async () => {
    vi.mocked(useCurrentUser).mockReturnValue(queryResult({ isError: true, status: "error" }));

    render(
      <AdminGuard>
        <p>Contenido administrativo</p>
      </AdminGuard>
    );

    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith(
        "/auth/login?reason=session_expired&callbackUrl=%2Fdashboard%2Fadmin%2Flibros"
      )
    );
  });

  it("redirects authenticated non-admin users to the dashboard", async () => {
    const user: User = {
      id: "user-1",
      email: "user@example.com",
      fullName: "Reader",
      isAdmin: false,
      lastLogin: "",
    };
    vi.mocked(useCurrentUser).mockReturnValue(queryResult({ data: user, isSuccess: true, status: "success" }));

    render(
      <AdminGuard>
        <p>Contenido administrativo</p>
      </AdminGuard>
    );

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/dashboard?reason=access_denied"));
  });
});
