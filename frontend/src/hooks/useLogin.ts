import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { loginSchema, type LoginInput, type AuthResponse } from "@/schemas/auth";

async function login(credentials: LoginInput): Promise<AuthResponse> {
  const formData = new URLSearchParams();
  formData.append("username", credentials.username);
  formData.append("password", credentials.password);

  const { data } = await api.post<AuthResponse>("/auth/login", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return data;
}

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: login,
    onSuccess: (auth) => {
      setAuth(auth);
      toast.success(`Bienvenido, ${auth.name}`);
      navigate({ to: "/dashboard" });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Credenciales inválidas");
    },
  });
}