import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EditIncomeDialog } from "./EditIncomeDialog";
import { IncomeService } from "../api/income.service";
import type { Income } from "../types";

const mockIncome: Income = {
    id: 1,
    car_id: 10,
    income_date_time: "2026-05-23T10:00:00Z",
    agreed_exit_date_time: "2026-05-25T18:00:00Z",
    exit_date_time: null,
    notes: "Golpe leve en puerta trasera derecha",
    photos: [],
    car: {
        id: 10,
        license_plate: "ABC-123",
        brand: "Toyota",
        model: "Corolla",
        year: 2020,
        color: "rojo",
        size: "medium",
        client_id: 5,
        client_name: "Juan Perez",
        created_at: "2026-05-20T00:00:00Z"
    },
    created_at: "2026-05-23T10:00:00Z"
};

describe("EditIncomeDialog component", () => {
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

    const renderComponent = (income: Income = mockIncome) => {
        return render(
            <QueryClientProvider client={queryClient}>
                <EditIncomeDialog income={income}>
                    <button data-testid="trigger-btn">Editar</button>
                </EditIncomeDialog>
            </QueryClientProvider>
        );
    };

    it("abre el dialogo al hacer click en el trigger", async () => {
        renderComponent();

        const trigger = screen.getByTestId("trigger-btn");
        fireEvent.click(trigger);

        expect(await screen.findByText("Editar Registro de Entrada")).toBeInTheDocument();
        expect(screen.getByLabelText(/Observaciones de Entrada/i)).toHaveValue("Golpe leve en puerta trasera derecha");
    });

    it("muestra/oculta el input de fecha de salida real al activar el switch", async () => {
        renderComponent();

        fireEvent.click(screen.getByTestId("trigger-btn"));

        // Por defecto, al no estar entregado (exit_date_time null), no debería mostrar el input de entrega real
        expect(screen.queryByLabelText(/Fecha\/Hora de Entrega Real/i)).not.toBeInTheDocument();

        // Activamos el switch de "Marcar como Entregado"
        const switchEl = screen.getByRole("switch");
        fireEvent.click(switchEl);

        // Ahora debe estar visible
        expect(await screen.findByLabelText(/Fecha\/Hora de Entrega Real/i)).toBeInTheDocument();
    });

    it("ejecuta la mutacion correctamente al enviar los cambios", async () => {
        const updateMock = vi.spyOn(IncomeService, "updateIncome").mockResolvedValue({
            ...mockIncome,
            notes: "Notas actualizadas",
        });

        renderComponent();

        fireEvent.click(screen.getByTestId("trigger-btn"));

        // Modificamos las observaciones
        const notesInput = screen.getByLabelText(/Observaciones de Entrada/i);
        fireEvent.change(notesInput, { target: { value: "Notas actualizadas" } });

        // Activamos el switch de entrega
        const switchEl = screen.getByRole("switch");
        fireEvent.click(switchEl);

        const submitBtn = screen.getByRole("button", { name: "Guardar Cambios" });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(updateMock).toHaveBeenCalled();
        });

        const lastCallArgs = updateMock.mock.calls[0];
        expect(lastCallArgs[0]).toBe(1); // incomeId
        expect(lastCallArgs[1].notes).toBe("Notas actualizadas");
        expect(lastCallArgs[1].exit_date_time).not.toBeNull();
    });
});
