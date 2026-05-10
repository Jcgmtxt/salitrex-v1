import { apiClient } from "@/shared/api/client";
import type { Client } from "../types";
import type { PaginatedResponse, ListQueryParams } from "@/shared/types/pagination";

export class CRMService {
    // Clients
    static async getClients(params?: ListQueryParams): Promise<PaginatedResponse<Client>> {
        const response = await apiClient.get<PaginatedResponse<Client>>("crm/clients/", { params });
        return response.data;
    }

    static async getClientById(id: number): Promise<Client> {
        const response = await apiClient.get<Client>(`crm/clients/${id}`);
        return response.data;
    }

    static async createClient(client: Client): Promise<Client> {
        const response = await apiClient.post<Client>("crm/clients/", client);
        return response.data;
    }

    static async updateClient(id: number, client: Client): Promise<Client> {
        const response = await apiClient.put<Client>(`crm/clients/${id}`, client);
        return response.data;
    }

    static async deleteClient(id: number): Promise<void> {
        await apiClient.delete<void>(`crm/clients/${id}`);
    }

    // Cars
}