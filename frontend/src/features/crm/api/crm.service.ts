import { apiClient } from "@/shared/api/client";
import type { Client, Car, ClientInput, CreateCarPayload, UpdateCarPayload } from "../types";
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

    static async createClient(data: ClientInput): Promise<Client> {
        const response = await apiClient.post<Client>("crm/clients/", data);
        return response.data;
    }

    static async updateClient(id: number, data: Partial<ClientInput>): Promise<Client> {
        const response = await apiClient.put<Client>(`crm/clients/${id}`, data);
        return response.data;
    }

    static async deleteClient(id: number): Promise<void> {
        await apiClient.delete<void>(`crm/clients/${id}`);
    }

    // Cars
    static async getCars(params?: ListQueryParams): Promise<PaginatedResponse<Car>> {
        const response = await apiClient.get<PaginatedResponse<Car>>("crm/cars/", { params });
        return response.data;
    }

    static async createCar(data: CreateCarPayload): Promise<Car> {
        const response = await apiClient.post<Car>("crm/cars/", data);
        return response.data;
    }

    static async updateCar(id: number, data: UpdateCarPayload): Promise<Car> {
        const response = await apiClient.put<Car>(`crm/cars/${id}`, data);
        return response.data;
    }

    static async deleteCar(id: number): Promise<void> {
        await apiClient.delete<void>(`crm/cars/${id}`);
    }
}