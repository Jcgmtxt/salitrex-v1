import { useClients } from "../hooks/use-clients";
import { UserPlus, Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ClientsTable } from "@/features/crm/components/ClientsTable";
import { ClientsMobileList } from "@/features/crm/components/ClientsMobileList";
import { ClientDialog } from "@/features/crm/components/ClientDialog";
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
            }}
            headerAction={
                <ClientDialog>
                    <Button className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Cliente
                    </Button>
                </ClientDialog>
            }
        >
            <ClientsTable clients={clients} />
            <ClientsMobileList clients={clients} />
        </DataLayout>
    );
}