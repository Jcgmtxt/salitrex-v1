import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { IncomeDetail } from "./IncomeDetail";
import { IncomeService } from "../api/income.service";
import type { Income } from "../types";

// Mock del router
vi.mock("@tanstack/react-router", () => ({
    Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

const mockIncome: Income = {
    id: 1,
    car_id: 10,
    income_date_time: "2026-05-23T10:00:00Z",
    agreed_exit_date_time: "2026-05-25T18:00:00Z",
    exit_date_time: null, // "En taller"
    notes: "Golpe leve en puerta trasera derecha",
    photos: [
        { id: 1, income_id: 1, s3_key: "photo1.jpg", category: "entry", presigned_url: "https://example.com/photo1.jpg" },
        { id: 2, income_id: 1, s3_key: "photo2.jpg", category: "process", presigned_url: "https://example.com/photo2.jpg" }
    ],
    paint_jobs: [
        {
            id: 1,
            income_id: 1,
            paint_type: "puerta trasera derecha",
            base_price: 300000,
            negotiated_price: 320000,
            margin_percent: 35.0,
            created_at: "2026-05-23T10:30:00Z"
        }
    ],
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

describe("IncomeDetail component", () => {
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

    const renderComponent = (incomeId: number = 1) => {
        return render(
            <QueryClientProvider client={queryClient}>
                <IncomeDetail incomeId={incomeId} />
            </QueryClientProvider>
        );
    };

    it("muestra skeleton de carga al inicio", async () => {
        vi.spyOn(IncomeService, "getIncomeById").mockReturnValue(
            new Promise(() => {})
        );

        renderComponent();

        // Debe haber skeletons en pantalla
        const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
        expect(skeletons.length).toBeGreaterThan(0);
        expect(screen.queryByText("Toyota Corolla")).not.toBeInTheDocument();
    });

    it("muestra error si la peticion falla", async () => {
        vi.spyOn(IncomeService, "getIncomeById").mockRejectedValue(new Error("API Error"));

        renderComponent();

        const errorMessage = await screen.findByText(/Error al cargar el detalle del ingreso/i);
        expect(errorMessage).toBeInTheDocument();
    });

    it("renderiza todos los detalles del ingreso del auto y cliente", async () => {
        vi.spyOn(IncomeService, "getIncomeById").mockResolvedValue(mockIncome);

        renderComponent();

        // Placa
        expect(await screen.findByText("ABC-123")).toBeInTheDocument();
        // Marca y modelo
        expect(screen.getByText("Toyota Corolla")).toBeInTheDocument();
        // Propietario
        expect(screen.getByText("Juan Perez")).toBeInTheDocument();
        // Estado
        expect(screen.getByText("En taller")).toBeInTheDocument();
        // Notas/observaciones
        expect(screen.getByText("Golpe leve en puerta trasera derecha")).toBeInTheDocument();
    });

    it("renderiza correctamente los trabajos de pintura asignados", async () => {
        vi.spyOn(IncomeService, "getIncomeById").mockResolvedValue(mockIncome);

        renderComponent();

        expect(await screen.findByText("puerta trasera derecha")).toBeInTheDocument();
        // Formato moneda de negotiated_price ($320.000 o similar en COP)
        expect(screen.getByText(/320.000/i)).toBeInTheDocument();
        // Margen
        expect(screen.getByText("35.0%")).toBeInTheDocument();
    });

    it("muestra mensaje alternativo si no hay trabajos de pintura", async () => {
        const incomeWithoutJobs = { ...mockIncome, paint_jobs: [] };
        vi.spyOn(IncomeService, "getIncomeById").mockResolvedValue(incomeWithoutJobs);

        renderComponent();

        expect(await screen.findByText(/No hay trabajos de pintura asignados/i)).toBeInTheDocument();
    });

    it("gestiona la visualizacion y cambio de tabs en la galeria de fotos", async () => {
        vi.spyOn(IncomeService, "getIncomeById").mockResolvedValue(mockIncome);

        renderComponent();

        // Por defecto tab activa es "Entrada" (entry)
        const activeTabButton = await screen.findByRole("button", { name: /Entrada/i });
        expect(activeTabButton).toBeInTheDocument();

        // Debe haber una foto de entrada
        const images = screen.getAllByRole("img");
        expect(images.length).toBeGreaterThan(0);

        // Click en la tab "Proceso"
        const processTabButton = screen.getByRole("button", { name: /Proceso/i });
        fireEvent.click(processTabButton);

        // Debería cambiar la tab y mostrar la foto de proceso
        await waitFor(() => {
            expect(processTabButton.className).toContain("text-indigo-400");
        });
    });
});
