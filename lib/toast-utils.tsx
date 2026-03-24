import { toast } from "sonner";
import { CheckCircle2, AlertCircle, Info, Ban, ShieldAlert } from "lucide-react";

export const showToast = {
    success: (title: string, description?: string, action?: { label: string; onClick: () => void }) => {
        toast.success(title, {
            description: description,
            icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
            className: "font-body border-l-4 border-l-emerald-500 bg-background",
            action: action,
        });
    },

    warning: (title: string, description?: string) => {
        toast.warning(title, {
            description: description,
            icon: <Ban className="h-5 w-5 text-amber-500" />,
            className: "font-body border-l-4 border-l-amber-500 bg-background",
            duration: 6000,
        });
    },

    error: (title: string, description: string = "Inténtalo de nuevo más tarde.") => {
        toast.error(title, {
            description: description,
            icon: <AlertCircle className="h-5 w-5 text-destructive" />,
            className: "font-body border-l-4 border-l-destructive bg-background",
        });
    },

    info: (title: string, description?: string) => {
        toast.info(title, {
            description: description,
            icon: <Info className="h-5 w-5 text-blue-500" />,
            className: "font-body border-l-4 border-l-blue-500 bg-background",
        });
    },
    
    apiError: (error: any) => {
        const status = error.response?.status;
        const message = error.response?.data?.message || "Ocurrió un error inesperado";

        if (status === 400 || status === 409) {
            showToast.warning("Acción no permitida", message);
            return;
        }

        if (status === 401) {
            showToast.error("Sesión expirada", "Por favor, ingresa de nuevo.");
            return;
        }
        if (status === 403) {
            showToast.error("Acceso denegado", "No tienes permisos para esta acción.");
            return;
        }
        showToast.error("Error del servidor", message);
    }
};