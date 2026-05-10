import axios from "axios";
import type { AxiosInstance } from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
    console.warn("[api] VITE_API_BASE_URL no está definida");
}


const apiClient: AxiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 10_000,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

export { apiClient };
