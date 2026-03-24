import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { registerSchema } from "@/schemas/auth.schema";
import { showToast } from "@/lib/toast-utils";

export const useRegister = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
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
        const result = registerSchema.safeParse(formData);

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
        fullName: formData.fullName,
        setFullName: (val: string) => handleChange("fullName", val),
        email: formData.email,
        setEmail: (val: string) => handleChange("email", val),
        password: formData.password,
        setPassword: (val: string) => handleChange("password", val),
        loading,
        errors,
        handleSubmit,
    };
};