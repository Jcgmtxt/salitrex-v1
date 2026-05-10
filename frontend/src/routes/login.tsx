import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "@/features/auth/components/LoginPage";
import { useAuthStore } from "@/features/auth/store";

export const Route = createFileRoute("/login")({
    /**
     * Antes de cargar la ruta, verificar si ya hay sesión activa.
     * Si el usuario ya está autenticado, redirigir directamente al dashboard.
     */
    beforeLoad: () => {
        const token = useAuthStore.getState().token;
        if (token) {
            throw redirect({ to: "/dashboard" });
        }
    },
    component: LoginPage,
});
