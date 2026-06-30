import { createFileRoute } from "@tanstack/react-router";
import { DashboardView } from "@/features/dashboard/components/DashboardView";

export const Route = createFileRoute("/_authenticated/dashboard")({
    component: () => (
        <div className="flex flex-col w-full">
            <DashboardView />
        </div>
    ),
});
