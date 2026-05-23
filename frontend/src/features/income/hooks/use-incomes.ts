import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { IncomeService } from "../api/income.service";
import type { ListQueryParams } from "@/shared/types/pagination";

export function useIncomes(params?: ListQueryParams) {
    return useQuery({
        queryKey: ["incomes", params],
        queryFn: () => IncomeService.getIncomes(params),
        placeholderData: keepPreviousData,
    });
}
