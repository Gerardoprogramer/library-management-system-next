import { describe, expect, it } from "vitest";

import { loginSchema, registerSchema } from "@/schemas/auth.schema";

describe("authentication schemas", () => {
  it("accepts valid login credentials after trimming the email", () => {
    const result = loginSchema.safeParse({
      email: " reader@example.com ",
      password: "secret",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("reader@example.com");
    }
  });

  it("rejects an invalid email and short registration password", () => {
    const result = registerSchema.safeParse({
      fullName: "Reader",
      email: "invalid-email",
      password: "short",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path[0])).toEqual(["email", "password"]);
    }
  });
});
