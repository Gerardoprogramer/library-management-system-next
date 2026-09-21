import { useState } from "react";
import { useRouter } from "next/navigation";

import { showToast } from "@/lib/toast-utils";
import { loginSchema } from "@/schemas/auth.schema";
import { authService } from "@/services/authService";

export const useLogin = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (field: keyof typeof credentials, value: string) => {
    setCredentials((current) => ({
      ...current,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((current) => {
        const nextErrors = {
          ...current,
        };

        delete nextErrors[field];

        return nextErrors;
      });
    }
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = loginSchema.safeParse(credentials);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;

        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);

      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await authService.login(result.data);

      showToast.success("Sesión iniciada", "Bienvenido de nuevo.");

      router.push("/dashboard");
    } catch (error) {
      showToast.apiError(error);
    } finally {
      setLoading(false);
    }
  }

  return {
    email: credentials.email,
    setEmail: (value: string) => handleChange("email", value),

    password: credentials.password,
    setPassword: (value: string) => handleChange("password", value),

    loading,
    errors,
    handleSubmit,
  };
};
