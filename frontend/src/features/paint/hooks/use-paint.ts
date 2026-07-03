import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PaintService } from "../api/paint.service";
import type { PaintConfigCreate, VehicleSizeAreaCreate, PaintJobCreate } from "../types";
import { toast } from "sonner";

export function useCalculatePrice(carId: number) {
    return useQuery({
        queryKey: ["paint", "calculate-price", carId],
        queryFn: () => PaintService.calculatePrice(carId),
        enabled: !isNaN(carId) && carId > 0,
    });
}

export function useActivePaintConfig() {
    return useQuery({
        queryKey: ["paint", "config"],
        queryFn: () => PaintService.getActiveConfig(),
    });
}

export function useUpdatePaintConfig() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (config: PaintConfigCreate) => PaintService.updateConfig(config),
        onSuccess: (data) => {
            toast.success(`Configuración actualizada: $${data.price_per_cm2}/cm², margen mín. ${data.min_margin_percent}%, margen obj. ${data.target_margin_percent}%`);
            queryClient.invalidateQueries({ queryKey: ["paint", "config"] });
        },
        onError: (error: any) => {
            const detail = error?.response?.data?.detail ?? "Error al actualizar la configuración.";
            toast.error(detail);
        },
    });
}

export function useVehicleAreas() {
    return useQuery({
        queryKey: ["paint", "areas"],
        queryFn: () => PaintService.getVehicleAreas(),
    });
}

export function useUpdateVehicleArea() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (area: VehicleSizeAreaCreate) => PaintService.updateVehicleArea(area),
        onSuccess: () => {
            toast.success("Área por tamaño de vehículo actualizada correctamente.");
            queryClient.invalidateQueries({ queryKey: ["paint", "areas"] });
        },
        onError: (error: any) => {
            const detail = error?.response?.data?.detail ?? "Error al actualizar el área.";
            toast.error(detail);
        },
    });
}

export function useCreatePaintJob(incomeId?: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (job: PaintJobCreate) => PaintService.createPaintJob(job),
        onSuccess: (data) => {
            toast.success(`Trabajo creado — Margen: ${data.margin_percent.toFixed(1)}%`);
            queryClient.invalidateQueries({ queryKey: ["incomes"] });
            if (incomeId) {
                queryClient.invalidateQueries({ queryKey: ["income", incomeId] });
            } else if (data.income_id) {
                queryClient.invalidateQueries({ queryKey: ["income", data.income_id] });
            }
        },
        onError: (error: any) => {
            const detail = error?.response?.data?.detail ?? "Error al registrar el trabajo de pintura.";
            toast.error(detail);
        },
    });
}
