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

    static async createIncome(formData: FormData, onProgress?: (percent: number) => void): Promise<Income> {
        const response = await apiClient.post<Income>("income/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percent);
                }
            },
        });
        return response.data;
    }

    static async updateIncome(id: number, data: Partial<Income>): Promise<Income> {
        const response = await apiClient.patch<Income>(`income/${id}`, data);
        return response.data;
    }
}
