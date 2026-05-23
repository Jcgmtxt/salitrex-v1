import { createFileRoute } from "@tanstack/react-router";
import { IncomesList } from "@/features/income/components/IncomesList";

interface IncomeSearch {
    query?: string;
    offset?: number;
    limit?: number;
}

export const Route = createFileRoute("/_authenticated/income/")({
    validateSearch: (search: Record<string, unknown>): IncomeSearch => ({
        query: (search.query as string) || undefined,
        offset: Number(search.offset) || 0,
        limit: Number(search.limit) || 20,
    }),
    component: () => (
        <div className="flex flex-col w-full">
            <IncomesList />
        </div>
    ),
});
