import { createFileRoute } from "@tanstack/react-router";
import { ClientDetail } from "@/features/crm/components/ClientDetail";

// TODO: Verificar con el cliente si correo y numero debe ser unico
// TODO: Implementar el borrado de clientes y de vehiculos
export const Route = createFileRoute("/_authenticated/clients/$clientId")({
    component: () => {
        const { clientId } = Route.useParams();
        return (
            <div className="flex flex-col w-full px-4 pt-4">
                <ClientDetail clientId={Number(clientId)} />
            </div>
        );
    },
});
