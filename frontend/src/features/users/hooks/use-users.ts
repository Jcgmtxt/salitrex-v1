import { keepPreviousData, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UsersService } from "../api/users.service";
import type { ListQueryParams } from "@/shared/types/pagination";
import type { UserCreate, UserUpdate } from "../types";
import { toast } from "sonner";

export function useUsers(params?: ListQueryParams) {
    return useQuery({
        queryKey: ["users", params],
        queryFn: () => UsersService.getUsers(params),
        placeholderData: keepPreviousData,
    });
}

export function useRegisterUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user: UserCreate) => UsersService.registerUser(user),
        onSuccess: (data) => {
            toast.success(`Usuario ${data.name} registrado con éxito.`);
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error: any) => {
            const detail = error?.response?.data?.detail ?? "Error al registrar el usuario.";
            toast.error(detail);
        },
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, user }: { id: number; user: UserUpdate }) => UsersService.updateUser(id, user),
        onSuccess: (data) => {
            toast.success(`Usuario ${data.name} actualizado con éxito.`);
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error: any) => {
            const detail = error?.response?.data?.detail ?? "Error al actualizar el usuario.";
            toast.error(detail);
        },
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => UsersService.deleteUser(id),
        onSuccess: () => {
            toast.success("Usuario eliminado/desactivado con éxito.");
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error: any) => {
            const detail = error?.response?.data?.detail ?? "Error al eliminar el usuario.";
            toast.error(detail);
        },
    });
}
