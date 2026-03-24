import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { showToast } from "@/lib/toast-utils";

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
    };
};