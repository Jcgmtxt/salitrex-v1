import { createFileRoute } from "@tanstack/react-router";
import { IncomeFormWizard } from "@/features/income/components/IncomeFormWizard";

export const Route = createFileRoute("/_authenticated/income/new")({
    component: () => (
        <div className="flex flex-col w-full">
            <div className="mb-6 space-y-1">
                <h1 className="text-2xl font-bold text-white tracking-tight">Nueva Entrada</h1>
                <p className="text-zinc-500 text-sm">Registrar el ingreso de un vehículo al taller</p>
            </div>
            <IncomeFormWizard />
        </div>
    ),
});
