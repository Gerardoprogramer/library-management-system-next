
import { useState } from "react";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import { registerSchema, loginSchema } from "@/schemas/auth.schema";
import { showToast } from "@/lib/toast-utils";

export const useRegister = () => {

  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
  }>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const result = registerSchema.safeParse({
      fullName,
      email,
      password,
    });

    if (!result.success) {
      const fieldErrors: any = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });

      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await authService.register(result.data);
      showToast.success("¡Cuenta creada!", "Bienvenido a Obsidian Library.");
      router.push("/dashboard");
    } catch (error: any) {
      showToast.apiError(error);
    } finally {
      setLoading(false);
    }
  }


  return {
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,

    loading,
    errors,

    handleSubmit,
  };
}


export const useLogin = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const result = loginSchema.safeParse({
      email,
      password,
    });

    if (!result.success) {
      const fieldErrors: any = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });

      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await authService.login({ email, password });
      showToast.success("Sesión iniciada", "Es bueno verte de nuevo.");
      router.push("/dashboard");
    } catch (error: any) {
      showToast.apiError(error);
    } finally {
      setLoading(false);
    }
  }
  return {
    email,
    setEmail,
    password,
    setPassword,

    loading,
    errors,

    handleSubmit
  }
}

export const useLogout = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      await authService.logout();
      showToast.info("Sesión cerrada", "Esperamos verte pronto por aquí.");
      router.push("/");
      router.refresh();
    } catch (error: any) {
      showToast.error("Error al salir", "No se pudo cerrar la sesión correctamente.");
    } finally {
      setIsLoading(false);
    }
  };
  return {
    handleLogout,
    isLoading
  }
}

