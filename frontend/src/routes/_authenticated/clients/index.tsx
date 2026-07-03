import { createFileRoute } from "@tanstack/react-router";
import { ClientsList } from "@/features/crm/components/ClientsList";

interface ClientsSearch {
    query?: string;
    offset?: number;
    limit?: number;
}

export const Route = createFileRoute("/_authenticated/clients/")({
    validateSearch: (search: Record<string, unknown>): ClientsSearch => ({
        query: (search.query as string) || undefined,
        offset: Number(search.offset) || 0,
        limit: Number(search.limit) || 20,
    }),
    component: () => (
        <div className="flex flex-col w-full">
            <ClientsList />
        </div>
    ),
});

