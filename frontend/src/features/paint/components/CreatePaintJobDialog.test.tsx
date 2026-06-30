import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CreatePaintJobDialog } from "./CreatePaintJobDialog";
import { PaintService } from "../api/paint.service";
import type { PricingCalculation, PaintJob } from "../types";

const mockPricing: PricingCalculation = {
    car_id: 1,
    car_size: "medium",
    area_cm2: 15000,
    price_per_cm2: 10,
    base_price: 150000,
    min_margin_percent: 30,
    target_margin_percent: 40,
    min_allowed_price: 214285, // 150000 / (1 - 0.3)
    target_allowed_price: 250000, // 150000 / (1 - 0.4)
};

const mockPaintJob: PaintJob = {
    id: 42,
    income_id: 10,
    paint_type: "Metálico Premium",
    base_price: 150000,
    negotiated_price: 260000,
    margin_percent: 42.3,
    created_at: "2026-06-30T10:00:00Z",
};

describe("CreatePaintJobDialog component", () => {
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

    const renderComponent = (incomeId = 10, carId = 1) => {
        return render(
            <QueryClientProvider client={queryClient}>
                <CreatePaintJobDialog 
                    incomeId={incomeId} 
                    carId={carId} 
                    trigger={<button data-testid="trigger-btn">Registrar Trabajo</button>}
                />
            </QueryClientProvider>
        );
    };

    it("abre el dialogo al hacer click en el trigger y muestra datos de referencia", async () => {
        vi.spyOn(PaintService, "calculatePrice").mockResolvedValue(mockPricing);

        renderComponent();

        const trigger = screen.getByTestId("trigger-btn");
        fireEvent.click(trigger);

        // Wait for loading to finish
        expect(await screen.findByText("Registrar Trabajo de Pintura")).toBeInTheDocument();
        
        // Check reference pricing is displayed
        expect(await screen.findByText(/Mínimo Permitido/i)).toBeInTheDocument();
        expect(screen.getByText(/Precio Recomendado/i)).toBeInTheDocument();
    });

    it("muestra advertencia y deshabilita boton si el precio es menor al minimo", async () => {
        vi.spyOn(PaintService, "calculatePrice").mockResolvedValue(mockPricing);

        renderComponent();

        fireEvent.click(screen.getByTestId("trigger-btn"));

        expect(await screen.findByText("Registrar Trabajo de Pintura")).toBeInTheDocument();

        const priceInput = await screen.findByLabelText(/Precio Negociado/i);
        // Type a price below minimum allowed ($214,285)
        fireEvent.change(priceInput, { target: { value: "180000" } });

        // Warning message should appear
        expect(await screen.findByText("Precio no permitido")).toBeInTheDocument();
        expect(screen.getByText(/Precio por debajo del margen mínimo/i)).toBeInTheDocument();

        // Submit button should be disabled
        const submitBtn = screen.getByRole("button", { name: "Registrar Trabajo" });
        expect(submitBtn).toBeDisabled();
    });

    it("muestra exito/margen verde y habilita boton si el precio es mayor al recomendado", async () => {
        vi.spyOn(PaintService, "calculatePrice").mockResolvedValue(mockPricing);

        renderComponent();

        fireEvent.click(screen.getByTestId("trigger-btn"));

        expect(await screen.findByText("Registrar Trabajo de Pintura")).toBeInTheDocument();

        const priceInput = await screen.findByLabelText(/Precio Negociado/i);
        // Type a price above recommended ($250,000)
        fireEvent.change(priceInput, { target: { value: "280000" } });

        // Success message should appear
        expect(await screen.findByText("Precio Excelente (Margen Ideal)")).toBeInTheDocument();

        // Submit button should be enabled
        const submitBtn = screen.getByRole("button", { name: "Registrar Trabajo" });
        expect(submitBtn).not.toBeDisabled();
    });

    it("envia el formulario correctamente y ejecuta la mutacion", async () => {
        vi.spyOn(PaintService, "calculatePrice").mockResolvedValue(mockPricing);
        const createMock = vi.spyOn(PaintService, "createPaintJob").mockResolvedValue(mockPaintJob);

        renderComponent();

        fireEvent.click(screen.getByTestId("trigger-btn"));

        expect(await screen.findByText("Registrar Trabajo de Pintura")).toBeInTheDocument();

        // Fill out form
        const typeInput = await screen.findByLabelText(/Tipo de Pintura/i);
        fireEvent.change(typeInput, { target: { value: "Metálico Premium" } });

        const priceInput = screen.getByLabelText(/Precio Negociado/i);
        fireEvent.change(priceInput, { target: { value: "260000" } });

        const submitBtn = screen.getByRole("button", { name: "Registrar Trabajo" });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(createMock).toHaveBeenCalledWith({
                income_id: 10,
                paint_type: "Metálico Premium",
                negotiated_price: 260000,
            });
        });
    });
});
