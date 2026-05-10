import { useClients } from "../hooks/use-clients";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "@/shared/components/ui/button";
import { UserPlus } from "lucide-react";
import { ClientsTable } from "./ClientsTable";
import { ClientsMobileList } from "./ClientsMobileList";

export function ClientsList() {
    const { data: clients, isLoading, error } = useClients();

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-red-400">
                <p>Error al cargar clientes: {error.message}</p>
            </div>
        );
    }

    if (isLoading) {
        return <ClientsSkeleton />;
    }

    if (!clients || clients.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-white/[0.08] rounded-xl bg-white/[0.02]">
                <div className="bg-indigo-500/10 p-4 rounded-full mb-4">
                    <UserPlus className="h-8 w-8 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">No hay clientes</h3>
                <p className="text-sm text-zinc-500 max-w-sm mt-1 mb-6">
                    Aún no has registrado ningún cliente. Registra tu primer cliente para comenzar a gestionar sus vehículos.
                </p>
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
                    Registrar primer cliente
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <ClientsTable clients={clients} />
            <ClientsMobileList clients={clients} />
        </div>
    );
}

function ClientsSkeleton() {
    return (
        <div className="space-y-4">
            {/* Desktop Skeleton */}
            <div className="hidden md:block rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center space-x-4">
                            <Skeleton className="h-12 w-full bg-white/[0.05]" />
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Mobile Skeleton */}
            <div className="grid gap-3 md:hidden">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-28 w-full rounded-xl bg-white/[0.05]" />
                ))}
            </div>
        </div>
    );
}