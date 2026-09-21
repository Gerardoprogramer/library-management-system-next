import { useState } from "react";
import { useRouter } from "next/navigation";

import { showToast } from "@/lib/toast-utils";
import { registerSchema } from "@/schemas/auth.schema";
import { authService } from "@/services/authService";

export const useRegister = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({
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

    const result = registerSchema.safeParse(formData);

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
      await authService.register(result.data);

      showToast.success("Cuenta creada", "Bienvenido a Biblioteca Obsidian.");

      router.push("/dashboard");
    } catch (error) {
      showToast.apiError(error);
    } finally {
      setLoading(false);
    }
  }

  return {
    fullName: formData.fullName,
    setFullName: (value: string) => handleChange("fullName", value),

    email: formData.email,
    setEmail: (value: string) => handleChange("email", value),

    password: formData.password,
    setPassword: (value: string) => handleChange("password", value),

    loading,
    errors,
    handleSubmit,
  };
};
