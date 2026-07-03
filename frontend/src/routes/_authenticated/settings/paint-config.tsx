import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/features/auth/store";
import { PaintConfigView } from "@/features/paint/components/PaintConfigView";

export const Route = createFileRoute("/_authenticated/settings/paint-config")({
    beforeLoad: () => {
        const { role } = useAuthStore.getState();
        if (role !== "admin") {
            throw redirect({ to: "/dashboard" });
        }
    },
    component: () => (
        <div className="flex flex-col w-full">
            <PaintConfigView />
        </div>
    ),
});
