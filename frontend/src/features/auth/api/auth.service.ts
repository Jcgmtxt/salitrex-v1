import type { AuthResponse, RefreshTokenResponse } from "../types";
import { apiClient } from "@/shared/api/client";

export class AuthService {
    static async login(email: string, password: string): Promise<AuthResponse> {
        const form = new URLSearchParams();
        form.append("username", email);
        form.append("password", password);

        const response = await apiClient.post<AuthResponse>("/auth/login", form, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        return response.data;
    }

    static async refreshToken(refresh_token: string): Promise<RefreshTokenResponse> {
        const response = await apiClient.post<RefreshTokenResponse>(
            "/auth/refresh",
            { refresh_token },
            { headers: { Authorization: `Bearer ${refresh_token}` } },
        );
        return response.data;
    }

    static async logout(): Promise<void> {
        await apiClient.post("/auth/logout");
    }
}
