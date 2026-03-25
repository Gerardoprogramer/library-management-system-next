import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { showToast } from "@/lib/toast-utils";
import { useQueryClient } from "@tanstack/react-query";

export const useLogout = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            await authService.logout();

            queryClient.clear();

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