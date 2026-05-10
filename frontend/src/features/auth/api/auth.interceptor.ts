import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../store";
import { AuthService } from "./auth.service";

interface RetryableRequest extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

export function setupAuthInterceptor(api: AxiosInstance): void {
    api.interceptors.request.use((config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config as RetryableRequest;

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                // TODO: Implementar refresh token
                // Intentar refrescar usando el token actual como refresh_token.
                // Si el backend maneja refresh_token separado, ajustar aquí.
                const currentToken = useAuthStore.getState().token;

                if (currentToken) {
                    try {
                        const { access_token } = await AuthService.refreshToken(currentToken);
                        useAuthStore.getState().setToken(access_token);
                        originalRequest.headers.Authorization = `Bearer ${access_token}`;
                        return api(originalRequest);
                    } catch {
                        // Refresh falló → cerrar sesión y redirigir
                    }
                }

                useAuthStore.getState().clearAuth();
                window.location.href = "/login";
                return Promise.reject(error);
            }

            return Promise.reject(error);
        },
    );
}