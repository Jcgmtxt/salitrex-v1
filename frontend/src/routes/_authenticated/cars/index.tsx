import { createFileRoute } from "@tanstack/react-router";
import { CarsList } from "@/features/crm/components/CarsList";

interface CarsSearch {
    query?: string;
    offset?: number;
    limit?: number;
}

export const Route = createFileRoute("/_authenticated/cars/")({
    validateSearch: (search: Record<string, unknown>): CarsSearch => ({
        query: (search.query as string) || undefined,
        offset: Number(search.offset) || 0,
        limit: Number(search.limit) || 20,
    }),
    component: () => (
        <div className="flex flex-col w-full">
            <CarsList />
        </div>
    ),
});
