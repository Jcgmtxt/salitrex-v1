import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { CRMService } from "../api/crm.service";
import type { ListQueryParams } from "@/shared/types/pagination";

export function useClients(params?: ListQueryParams) {
    return useQuery({
        queryKey: ["clients", params],
        queryFn: () => CRMService.getClients(params),
        placeholderData: keepPreviousData,
    });
}