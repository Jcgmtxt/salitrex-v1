import { z } from "zod";

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    name: string;
    email: string;
    role: "admin" | "operator";
}

export interface RefreshTokenResponse {
    access_token: string;
    refresh_token: string;
}

export interface User {
    email: string;
    name: string;
    role: "admin" | "operator";
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
}

export const loginSchema = z.object({
    email: z.string().email("Ingresa un email válido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;