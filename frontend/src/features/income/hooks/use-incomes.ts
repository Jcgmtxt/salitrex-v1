import { keepPreviousData, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IncomeService } from "../api/income.service";
import type { ListQueryParams } from "@/shared/types/pagination";
import type { Income } from "../types";
import { toast } from "sonner";

export function useIncomes(params?: ListQueryParams) {
    return useQuery({
        queryKey: ["incomes", params],
        queryFn: () => IncomeService.getIncomes(params),
        placeholderData: keepPreviousData,
    });
}

export function useIncome(id: number) {
    return useQuery({
        queryKey: ["income", id],
        queryFn: () => IncomeService.getIncomeById(id),
        enabled: !isNaN(id) && id > 0,
    });
}

export function useCreateIncome() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ formData, onProgress }: { formData: FormData; onProgress?: (p: number) => void }) =>
            IncomeService.createIncome(formData, onProgress),
        onSuccess: () => {
            toast.success("Entrada registrada con éxito para el vehículo.");
            queryClient.invalidateQueries({ queryKey: ["incomes"] });
        },
        onError: (error: any) => {
            const detail = error?.response?.data?.detail ?? "Error al registrar la entrada del vehículo.";
            toast.error(detail);
        },
    });
}

export function useUpdateIncome() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<Income> }) =>
            IncomeService.updateIncome(id, data),
        onSuccess: (data) => {
            toast.success("Entrada actualizada correctamente.");
            queryClient.invalidateQueries({ queryKey: ["incomes"] });
            queryClient.invalidateQueries({ queryKey: ["income", data.id] });
        },
        onError: (error: any) => {
            const detail = error?.response?.data?.detail ?? "Error al actualizar la entrada.";
            toast.error(detail);
        },
    });
}

export function useCreateIncomeNote() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ incomeId, note }: { incomeId: number; note: string }) =>
            IncomeService.addIncomeNote(incomeId, note),
        onSuccess: (_, { incomeId }) => {
            toast.success("Nota agregada a la bitácora con éxito.");
            queryClient.invalidateQueries({ queryKey: ["income", incomeId] });
        },
        onError: (error: any) => {
            const detail = error?.response?.data?.detail ?? "Error al agregar la nota.";
            toast.error(detail);
        },
    });
}

export function useCreateIncomePhoto() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ incomeId, file, category }: { incomeId: number; file: File; category: string }) =>
            IncomeService.addIncomePhoto(incomeId, file, category),
        onSuccess: (_, { incomeId }) => {
            toast.success("Fotografía agregada con éxito.");
            queryClient.invalidateQueries({ queryKey: ["income", incomeId] });
        },
        onError: (error: any) => {
            const detail = error?.response?.data?.detail ?? "Error al subir la fotografía.";
            toast.error(detail);
        },
    });
}
