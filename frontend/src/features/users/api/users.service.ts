import { apiClient } from "@/shared/api/client";
import type { User, UserCreate, UserUpdate } from "../types";
import type { PaginatedResponse, ListQueryParams } from "@/shared/types/pagination";

export class UsersService {
    static async getUsers(params?: ListQueryParams): Promise<PaginatedResponse<User>> {
        const response = await apiClient.get<PaginatedResponse<User>>("auth/users", { params });
        return response.data;
    }

    static async registerUser(user: UserCreate): Promise<User> {
        const response = await apiClient.post<User>("auth/register", user);
        return response.data;
    }

    static async updateUser(id: number, user: UserUpdate): Promise<User> {
        const response = await apiClient.put<User>(`auth/users/${id}`, user);
        return response.data;
    }

    static async deleteUser(id: number): Promise<void> {
        await apiClient.delete(`auth/users/${id}`);
    }
}
