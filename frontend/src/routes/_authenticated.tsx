import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/features/auth/store";
import { AppShell } from "@/shared/components/layout/AppShell";

export const Route = createFileRoute("/_authenticated")({
    beforeLoad: () => {
        const token = useAuthStore.getState().token;
        if (!token) {
            throw redirect({ to: "/login" });
        }
    },
    component: () => (
        <AppShell>
            <Outlet />
        </AppShell>
    ),
});
