import { useIncomes } from "../hooks/use-incomes";
import { Wrench, Plus } from "lucide-react";
import { IncomesTable } from "./IncomesTable";
import { IncomesMobileList } from "./IncomesMobileList";
import { useListParams } from "@/shared/hooks/use-list-params";
import { DataLayout } from "@/shared/components/data-view/DataLayout";
import { Button } from "@/shared/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

export function IncomesList() {
    const navigate = useNavigate();
    const listParams = useListParams();
    const { data, isLoading, error, isPlaceholderData } = useIncomes(listParams.params);

    const incomes = data?.items ?? [];
    const total = data?.total ?? 0;

    const handleNewIncome = () => {
        navigate({ to: "/income/new" });
    };

    return (
        <DataLayout
            data={incomes}
            total={total}
            isLoading={isLoading}
            isPlaceholderData={isPlaceholderData}
            error={error}
            params={listParams.params}
            setQuery={listParams.setQuery}
            setPage={listParams.setPage}
            setLimit={listParams.setLimit}
            currentPage={listParams.currentPage}
            searchPlaceholder="Buscar por placa o nombre de cliente..."
            emptyState={{
                icon: Wrench,
                title: "No hay entradas de servicio",
                description: "Aún no se han registrado ingresos de vehículos al taller.",
                actionLabel: "Nueva Entrada",
                onAction: handleNewIncome,
            }}
            headerAction={
                <Button 
                    onClick={handleNewIncome}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Entrada
                </Button>
            }
        >
            <IncomesTable incomes={incomes} />
            <IncomesMobileList incomes={incomes} />
        </DataLayout>
    );
}
