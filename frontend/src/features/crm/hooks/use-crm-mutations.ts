import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CRMService } from "@/features/crm/api/crm.service";
import { toast } from "sonner";
import type { ClientInput, CreateCarPayload } from "@/features/crm/types";

export function useCRMMutations() {
    const queryClient = useQueryClient();

    const invalidateClients = () =>
        queryClient.invalidateQueries({ queryKey: ["clients"] });

    const createClient = useMutation({
        mutationFn: (data: ClientInput) => CRMService.createClient(data),
        onSuccess: () => {
            toast.success("Cliente registrado con éxito");
            invalidateClients();
        },
        onError: (error: Error & { response?: { data?: { detail?: string } } }) => {
            toast.error(error.response?.data?.detail || "Error al registrar cliente");
        },
    });

    const createCar = useMutation({
        mutationFn: (data: CreateCarPayload) => CRMService.createCar(data),
        onSuccess: () => {
            toast.success("Vehículo registrado con éxito");
            invalidateClients();
        },
        onError: (error: Error & { response?: { data?: { detail?: string } } }) => {
            toast.error(error.response?.data?.detail || "Error al registrar vehículo");
        },
    });

    const updateClient = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<ClientInput> }) =>
            CRMService.updateClient(id, data),
        onSuccess: () => {
            toast.success("Cliente actualizado con éxito");
            invalidateClients();
        },
        onError: (error: Error & { response?: { data?: { detail?: string } } }) => {
            toast.error(error.response?.data?.detail || "Error al actualizar cliente");
        },
    });

    const updateCar = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<CreateCarPayload> }) =>
            CRMService.updateCar(id, data),
        onSuccess: () => {
            toast.success("Vehículo actualizado con éxito");
            invalidateClients();
            queryClient.invalidateQueries({ queryKey: ["cars"] });
        },
        onError: (error: Error & { response?: { data?: { detail?: string } } }) => {
            toast.error(error.response?.data?.detail || "Error al actualizar vehículo");
        },
    });

    return { createClient, updateClient, createCar, updateCar };
}
