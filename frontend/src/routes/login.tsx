import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "@/features/auth/components/LoginPage";
import { useAuthStore } from "@/features/auth/store";

export const Route = createFileRoute("/login")({
    beforeLoad: () => {
        const token = useAuthStore.getState().token;
        if (token) {
            throw redirect({ to: "/dashboard" });
        }
    },
    component: LoginPage,
});
