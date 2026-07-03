import { createFileRoute } from "@tanstack/react-router";
import { PaintPricingCalculator } from "@/features/paint/components/PaintPricingCalculator";

interface PaintSearch {
    carId?: number;
}

export const Route = createFileRoute("/_authenticated/paint/")({
    validateSearch: (search: Record<string, unknown>): PaintSearch => ({
        carId: search.carId ? Number(search.carId) : undefined,
    }),
    component: () => {
        const { carId } = Route.useSearch();
        return (
            <div className="flex flex-col w-full">
                <PaintPricingCalculator initialCarId={carId} />
            </div>
        );
    },
});
