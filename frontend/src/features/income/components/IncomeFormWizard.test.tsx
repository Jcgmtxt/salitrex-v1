import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { IncomeFormWizard } from "./IncomeFormWizard";
import { useCars } from "@/features/crm/hooks/use-cars";

// Mock de useCars
vi.mock("@/features/crm/hooks/use-cars", () => ({
    useCars: vi.fn(),
}));

// Mock del router
const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
    useNavigate: () => mockNavigate,
}));

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("IncomeFormWizard component", () => {
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

        // Valor por defecto para useCars
        (useCars as any).mockReturnValue({
            data: {
                items: [
                    {
                        id: 1,
                        license_plate: "ABC-123",
                        brand: "Toyota",
                        model: "Corolla",
                        year: 2020,
                        color: "rojo",
                        size: "medium",
                        client_id: 5,
                        client_name: "Juan Perez",
                        created_at: "2026-05-20T00:00:00Z"
                    }
                ],
                total: 1
            },
            isLoading: false
        });
    });

    const renderComponent = () => {
        return render(
            <QueryClientProvider client={queryClient}>
                <IncomeFormWizard />
            </QueryClientProvider>
        );
    };

    it("inicia en el Paso 1 y muestra el buscador de vehículos", () => {
        renderComponent();
        
        expect(screen.getByText("Buscar Vehículo *")).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Escribe la placa, marca o modelo/i)).toBeInTheDocument();
    });

    it("no permite avanzar si no hay auto seleccionado", () => {
        renderComponent();
        
        // Hacemos click en "Siguiente"
        const nextButton = screen.getByText("Siguiente");
        fireEvent.click(nextButton);

        // Debería quedarse en el paso 1 (buscador de auto visible)
        expect(screen.getByText("Buscar Vehículo *")).toBeInTheDocument();
    });

    it("avanza al paso 2 y paso 3 despues de seleccionar un auto", async () => {
        renderComponent();

        // Escribimos en la búsqueda para disparar resultados
        const searchInput = screen.getByPlaceholderText(/Escribe la placa, marca o modelo/i);
        fireEvent.focus(searchInput);
        fireEvent.change(searchInput, { target: { value: "ABC" } });

        // Esperamos a que pase el debounce (300ms)
        await delay(400);

        // Seleccionamos el vehículo mock de la lista
        const carOption = await screen.findByText("ABC-123");
        fireEvent.click(carOption);

        // Avanzamos al Paso 2 (Detalles)
        const nextButton = screen.getByText("Siguiente");
        fireEvent.click(nextButton);

        // En Paso 2 deben estar los campos de notas y salida
        expect(screen.getByText("Notas y Observaciones de Ingreso")).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Detalla daños en carrocería/i)).toBeInTheDocument();

        // Escribimos notas
        const textarea = screen.getByPlaceholderText(/Detalla daños en carrocería/i);
        fireEvent.change(textarea, { target: { value: "Rayón en puerta izquierda" } });

        // Avanzamos al Paso 3 (Fotos)
        fireEvent.click(screen.getByText("Siguiente"));

        // En Paso 3 debe estar la zona de carga de fotos
        expect(screen.getByText("Tomar Fotos o Seleccionar Archivos")).toBeInTheDocument();
    });
});
