
import { useState } from "react";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import { registerSchema, loginSchema } from "@/schemas/auth.schema";
import { toast } from "sonner";

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
      router.push("/dashboard");
      toast.success("Bienvenido a Obsidian Library");
    } catch (error: any) {
      toast.error(error.message || "Error al registrarse");
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
      router.push("/dashboard");
      toast.success("Bienvenido de nuevo");
    } catch (error: any) {
      toast.error(error.message || "Error al iniciar sesión");
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
      toast.success("Sesión cerrada");
      router.push("/");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Error al cerrar sesión");
    } finally {
      setIsLoading(false);
    }
  };
  return {
    handleLogout,
    isLoading
  }
}

