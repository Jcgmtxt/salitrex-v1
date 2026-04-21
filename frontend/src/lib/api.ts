import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/auth";

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  console.warn("[api] VITE_API_BASE_URL no está definida en el .env");
}

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

function createApiClient(): AxiosInstance {
  const api = axios.create({
    baseURL,
    timeout: 10_000,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

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

        try {
          const { data } = await axios.post<{ access_token: string }>(
            `${baseURL}/api/v1/auth/refresh`,
            {},
            { withCredentials: true }
          );

          useAuthStore.getState().setToken(data.access_token);
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          return api(originalRequest);
        } catch {
          useAuthStore.getState().clearAuth();
          window.location.href = "/login";
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
}

export const api = createApiClient();