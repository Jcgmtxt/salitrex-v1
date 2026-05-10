import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/features/auth/store";

/**
 * Layout route de protección de autenticación.
 *
 * Todas las rutas anidadas bajo _authenticated/ (dashboard, clients, etc.)
 * heredarán esta protección automáticamente.
 *
 * HU-02 añadirá el shell (sidebar/bottom nav) como componente de este layout.
 */
export const Route = createFileRoute("/_authenticated")({
    beforeLoad: () => {
        const token = useAuthStore.getState().token;
        if (!token) {
            throw redirect({ to: "/login" });
        }
    },
    component: () => <Outlet />,
});
