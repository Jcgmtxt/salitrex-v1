import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AuthService } from "../api/auth.service";
import { useAuthStore } from "../store";
import { type LoginFormValues, loginSchema } from "../types";

export function useLogin() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const mutation = useMutation({
        mutationFn: ({ email, password }: LoginFormValues) =>
            AuthService.login(email, password),
        onSuccess: (data) => {
            setAuth({
                token: data.access_token,
                name: data.name,
                email: data.email,
                role: data.role,
            });
            navigate({ to: "/dashboard" });
        },
        onError: (error: unknown) => {
            const msg =
                (error as { response?: { data?: { detail?: string } } })?.response?.data
                    ?.detail ?? "Credenciales incorrectas. Inténtalo de nuevo.";
            toast.error(msg);
        },
    });

    const onSubmit = form.handleSubmit((values: LoginFormValues) => mutation.mutate(values));

    return {
        form,
        onSubmit,
        isPending: mutation.isPending,
        serverError: mutation.error
            ? ((mutation.error as { response?: { data?: { detail?: string } } })?.response
                ?.data?.detail ?? "Error al iniciar sesión")
            : null,
    };
}
