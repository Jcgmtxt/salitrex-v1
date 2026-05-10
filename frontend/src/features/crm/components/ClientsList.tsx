import { useClients } from "../hooks/use-clients";
import { UserPlus } from "lucide-react";
import { ClientsTable } from "./ClientsTable";
import { ClientsMobileList } from "./ClientsMobileList";
import { useListParams } from "@/shared/hooks/use-list-params";
import { DataLayout } from "@/shared/components/data-view/DataLayout";

export function ClientsList() {
    const listParams = useListParams();
    const { data, isLoading, error, isPlaceholderData } = useClients(listParams.params);

    const clients = data?.items ?? [];
    const total = data?.total ?? 0;

    return (
        <DataLayout
            data={clients}
            total={total}
            isLoading={isLoading}
            isPlaceholderData={isPlaceholderData}
            error={error}
            params={listParams.params}
            setQuery={listParams.setQuery}
            setPage={listParams.setPage}
            setLimit={listParams.setLimit}
            currentPage={listParams.currentPage}
            searchPlaceholder="Buscar por nombre, cédula o teléfono..."
            emptyState={{
                icon: UserPlus,
                title: "No hay clientes",
                description: "Aún no has registrado ningún cliente. Registra tu primer cliente para comenzar a gestionar sus vehículos.",
                actionLabel: "Registrar primer cliente",
                onAction: () => console.log("Registrar cliente"), // WIP para HU-06
            }}
        >
            <ClientsTable clients={clients} />
            <ClientsMobileList clients={clients} />
        </DataLayout>
    );
}