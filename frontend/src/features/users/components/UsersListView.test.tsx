import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UsersListView } from "./UsersListView";
import { UsersService } from "../api/users.service";
import { useAuthStore } from "@/features/auth/store";
import type { PaginatedResponse } from "@/shared/types/pagination";
import type { User } from "../types";

// Mock router link to prevent TanStack Router errors during test rendering
vi.mock("@tanstack/react-router", () => ({
    Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

const mockUsersResponse: PaginatedResponse<User> = {
    items: [
        { id: 1, name: "Admin Salitrex", email: "admin@salitrex.com", role: "admin" },
        { id: 2, name: "Operador Uno", email: "operator@salitrex.com", role: "operator" },
    ],
    total: 2,
    offset: 0,
    limit: 20,
};

describe("UsersListView component", () => {
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
        
        // Setup Zustand auth store values for test
        useAuthStore.setState({
            token: "valid-token",
            name: "Admin Salitrex",
            email: "admin@salitrex.com",
            role: "admin",
        });
    });

    const renderComponent = () => {
        return render(
            <QueryClientProvider client={queryClient}>
                <UsersListView />
            </QueryClientProvider>
        );
    };

    it("renderiza la lista de usuarios correctamente", async () => {
        vi.spyOn(UsersService, "getUsers").mockResolvedValue(mockUsersResponse);

        renderComponent();

        const adminElements = await screen.findAllByText("Admin Salitrex");
        expect(adminElements.length).toBeGreaterThan(0);
        expect(screen.getAllByText("operator@salitrex.com").length).toBeGreaterThan(0);
        expect(screen.getAllByText("Operador Uno").length).toBeGreaterThan(0);
    });

    it("deshabilita la opcion de eliminar para el usuario administrador actualmente logueado", async () => {
        vi.spyOn(UsersService, "getUsers").mockResolvedValue(mockUsersResponse);

        renderComponent();

        // Wait for the table rows to render
        const adminElements = await screen.findAllByText("Admin Salitrex");
        expect(adminElements.length).toBeGreaterThan(0);

        // Find the delete button for admin@salitrex.com (it has a title or is disabled)
        // Wait, the Trash2 button for self is disabled:
        const adminRowDeleteBtns = screen.getAllByTitle("No puedes eliminarte a ti mismo");
        expect(adminRowDeleteBtns[0]).toBeDisabled();

        // The button for the other user should not be disabled
        const opRowDeleteBtns = screen.getAllByTitle("Eliminar usuario");
        expect(opRowDeleteBtns[0]).not.toBeDisabled();
    });

    it("abre confirmacion de eliminacion y ejecuta deleteUser al confirmar", async () => {
        vi.spyOn(UsersService, "getUsers").mockResolvedValue(mockUsersResponse);
        const deleteMock = vi.spyOn(UsersService, "deleteUser").mockResolvedValue();

        renderComponent();

        const opElements = await screen.findAllByText("Operador Uno");
        expect(opElements.length).toBeGreaterThan(0);

        // Click delete on the operator row
        const opRowDeleteBtns = screen.getAllByTitle("Eliminar usuario");
        fireEvent.click(opRowDeleteBtns[0]);

        // Confirmation dialog should appear
        expect(await screen.findByText("¿Eliminar usuario?")).toBeInTheDocument();
        expect(screen.getByText(/desea eliminar a/i)).toHaveTextContent("Operador Uno");

        // Click confirm
        const confirmBtn = screen.getByRole("button", { name: "Confirmar Eliminación" });
        fireEvent.click(confirmBtn);

        await waitFor(() => {
            expect(deleteMock).toHaveBeenCalledWith(2);
        });
    });
});
