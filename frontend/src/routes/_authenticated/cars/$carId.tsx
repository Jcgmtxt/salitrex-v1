import { createFileRoute } from "@tanstack/react-router";
import { CarDetail } from "@/features/crm/components/CarDetail";

export const Route = createFileRoute("/_authenticated/cars/$carId")({
    component: () => {
        const { carId } = Route.useParams();
        return (
            <div className="flex flex-col w-full px-4 pt-4">
                <CarDetail carId={Number(carId)} />
            </div>
        );
    },
});
