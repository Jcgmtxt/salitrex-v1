import { useQuery } from "@tanstack/react-query";
import { CRMService } from "../api/crm.service";

export function useClients() {
    return useQuery({
        queryKey: ["clients"],
        queryFn: CRMService.getClients,
    });
}