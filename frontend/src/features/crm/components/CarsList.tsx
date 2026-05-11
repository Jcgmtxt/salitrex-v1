import { useCars } from "../hooks/use-cars";
import { Car } from "lucide-react";
import { CarsTable } from "@/features/crm/components/CarsTable";
import { CarsMobileList } from "@/features/crm/components/CarsMobileList";
import { useListParams } from "@/shared/hooks/use-list-params";
import { DataLayout } from "@/shared/components/data-view/DataLayout";

export function CarsList() {
    const listParams = useListParams();
    const { data, isLoading, error, isPlaceholderData } = useCars(listParams.params);

    const cars = data?.items ?? [];
    const total = data?.total ?? 0;

    return (
        <DataLayout
            data={cars}
            total={total}
            isLoading={isLoading}
            isPlaceholderData={isPlaceholderData}
            error={error}
            params={listParams.params}
            setQuery={listParams.setQuery}
            setPage={listParams.setPage}
            setLimit={listParams.setLimit}
            currentPage={listParams.currentPage}
            searchPlaceholder="Buscar por placa, marca o modelo..."
            emptyState={{
                icon: Car,
                title: "No hay vehículos",
                description: "Aún no hay vehículos registrados en el sistema. Puedes registrarlos desde el perfil de un cliente.",
                actionLabel: "", // Omitimos acción principal global porque un auto requiere un cliente.
            }}
        >
            <CarsTable cars={cars} />
            <CarsMobileList cars={cars} />
        </DataLayout>
    );
}
