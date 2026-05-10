import { createFileRoute } from "@tanstack/react-router";
import { ClientsList } from "@/features/crm/components/ClientsList";

export const Route = createFileRoute("/_authenticated/clients/")({
    component: () => (
        <div className="flex flex-col w-full">
            <ClientsList />
        </div>
    ),
});
