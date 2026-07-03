import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/features/auth/store";
import { UsersListView } from "@/features/users/components/UsersListView";

export const Route = createFileRoute("/_authenticated/settings/users")({
    beforeLoad: () => {
        const { role } = useAuthStore.getState();
        if (role !== "admin") {
            throw redirect({ to: "/dashboard" });
        }
    },
    component: () => (
        <div className="flex flex-col w-full">
            <UsersListView />
        </div>
    ),
});
