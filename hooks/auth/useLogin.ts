import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { loginSchema } from "@/schemas/auth.schema";
import { showToast } from "@/lib/toast-utils";

export const useLogin = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });

    const handleChange = (field: string, value: string) => {
        setCredentials((prev) => ({ ...prev, [field]: value }));

        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const result = loginSchema.safeParse(credentials);

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                fieldErrors[issue.path[0] as string] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            await authService.login(credentials);
            showToast.success("Sesión iniciada", "Es bueno verte de nuevo.");
            router.push("/dashboard");
        } catch (error: any) {

            showToast.apiError(error);
        } finally {
            setLoading(false);
        }
    }

    return {
        email: credentials.email,
        setEmail: (val: string) => handleChange("email", val),
        password: credentials.password,
        setPassword: (val: string) => handleChange("password", val),
        loading,
        errors,
        handleSubmit
    };
};