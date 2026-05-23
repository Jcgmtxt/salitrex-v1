import { apiClient } from "@/shared/api/client";
import type { Income } from "../types";
import type { PaginatedResponse, ListQueryParams } from "@/shared/types/pagination";

export class IncomeService {
    static async getIncomes(params?: ListQueryParams): Promise<PaginatedResponse<Income>> {
        const response = await apiClient.get<PaginatedResponse<Income>>("income/", { params });
        return response.data;
    }

    static async getIncomeById(id: number): Promise<Income> {
        const response = await apiClient.get<Income>(`income/${id}`);
        return response.data;
    }
}
