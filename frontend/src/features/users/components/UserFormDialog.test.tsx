import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserFormDialog } from "./UserFormDialog";
import { UsersService } from "../api/users.service";
import type { User } from "../types";

const mockUser: User = {
    id: 1,
    name: "Juan Perez",
    email: "juan@salitrex.com",
    role: "operator",
};

describe("UserFormDialog component", () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });
        vi.clearAllMocks();
    });

    const renderComponent = (user?: User) => {
        return render(
            <QueryClientProvider client={queryClient}>
                <UserFormDialog 
                    user={user} 
                    trigger={<button data-testid="trigger-btn">{user ? "Editar" : "Nuevo"}</button>}
                />
            </QueryClientProvider>
        );
    };

    it("abre el dialogo de creacion al hacer click en el trigger", async () => {
        renderComponent();

        const trigger = screen.getByTestId("trigger-btn");
        fireEvent.click(trigger);

        expect(await screen.findByText("Crear Nuevo Usuario")).toBeInTheDocument();
        expect(screen.getByLabelText(/Nombre Completo/i)).toHaveValue("");
        expect(screen.getByLabelText(/Correo Electrónico/i)).toHaveValue("");
    });

    it("valida contraseña requerida de minimo 8 caracteres en creacion", async () => {
        renderComponent();

        fireEvent.click(screen.getByTestId("trigger-btn"));

        // Fill out other fields
        fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: "Pedro Gomez" } });
        fireEvent.change(screen.getByLabelText(/Correo/i), { target: { value: "pedro@salitrex.com" } });
        
        // Type a short password
        fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: "12345" } });

        const submitBtn = screen.getByRole("button", { name: "Crear Usuario" });
        fireEvent.click(submitBtn);

        expect(await screen.findByText("La contraseña debe tener al menos 8 caracteres")).toBeInTheDocument();
    });

    it("permite contraseña en blanco (opcional) durante edicion", async () => {
        const updateMock = vi.spyOn(UsersService, "updateUser").mockResolvedValue({
            ...mockUser,
            name: "Juan Perez Editado",
        });

        renderComponent(mockUser);

        fireEvent.click(screen.getByTestId("trigger-btn"));

        expect(await screen.findByText("Editar Usuario")).toBeInTheDocument();
        expect(screen.getByLabelText(/Nombre Completo/i)).toHaveValue("Juan Perez");
        expect(screen.getByLabelText(/Correo/i)).toHaveValue("juan@salitrex.com");

        // Edit name, leave password blank
        fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: "Juan Perez Editado" } });

        const submitBtn = screen.getByRole("button", { name: "Guardar Cambios" });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(updateMock).toHaveBeenCalledWith(1, {
                id: 1,
                name: "Juan Perez Editado",
                email: "juan@salitrex.com",
                password: "NO_CHANGE", // Sentinel passed when blank
                role: "operator",
            });
        });
    });

    it("registra un nuevo usuario exitosamente", async () => {
        const registerMock = vi.spyOn(UsersService, "registerUser").mockResolvedValue(mockUser);

        renderComponent();

        fireEvent.click(screen.getByTestId("trigger-btn"));

        fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: "Juan Perez" } });
        fireEvent.change(screen.getByLabelText(/Correo/i), { target: { value: "juan@salitrex.com" } });
        fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: "securepassword123" } });

        const submitBtn = screen.getByRole("button", { name: "Crear Usuario" });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(registerMock).toHaveBeenCalledWith({
                name: "Juan Perez",
                email: "juan@salitrex.com",
                password: "securepassword123",
                role: "operator",
            });
        });
    });
});
