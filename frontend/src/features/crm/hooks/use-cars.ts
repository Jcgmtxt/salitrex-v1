import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { CRMService } from "../api/crm.service";
import type { ListQueryParams } from "@/shared/types/pagination";

export function useCars(params?: ListQueryParams) {
    return useQuery({
        queryKey: ["cars", params],
        queryFn: () => CRMService.getCars(params),
        placeholderData: keepPreviousData,
    });
}

export function useCar(id: number) {
    return useQuery({
        queryKey: ["cars", id],
        queryFn: () => CRMService.getCarById(id),
        enabled: !!id,
    });
}
