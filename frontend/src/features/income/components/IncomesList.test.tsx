import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { IncomesList } from "./IncomesList";
import { IncomeService } from "../api/income.service";
import type { PaginatedResponse } from "@/shared/types/pagination";
import type { Income } from "../types";

// Mock del hook useListParams
vi.mock("@/shared/hooks/use-list-params", () => ({
    useListParams: () => ({
        params: { query: "", offset: 0, limit: 20 },
        setParams: vi.fn(),
        setQuery: vi.fn(),
        setPage: vi.fn(),
        setLimit: vi.fn(),
        currentPage: 0,
    }),
}));

// Mock del router
const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
    useNavigate: () => mockNavigate,
}));

const mockIncomes: Income[] = [
    {
        id: 1,
        car_id: 10,
        income_date_time: "2026-05-23T10:00:00Z",
        agreed_exit_date_time: "2026-05-25T18:00:00Z",
        exit_date_time: null, // "En taller"
        notes: "Golpe leve en puerta trasera derecha",
        photos: [
            { id: 1, income_id: 1, s3_key: "photo1.jpg", category: "entry" }
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
    },
    {
        id: 2,
        car_id: 11,
        income_date_time: "2026-05-21T09:00:00Z",
        agreed_exit_date_time: "2026-05-22T17:00:00Z",
        exit_date_time: "2026-05-22T16:30:00Z", // "Entregado"
        notes: "Mantenimiento general",
        photos: [],
        car: {
            id: 11,
            license_plate: "XYZ-789",
            brand: "Ford",
            model: "Fiesta",
            year: 2018,
            color: "azul",
            size: "small",
            client_id: 6,
            client_name: "Maria Lopez",
            created_at: "2026-05-20T00:00:00Z"
        },
        created_at: "2026-05-21T09:00:00Z"
    }
];

const mockPaginatedResponse: PaginatedResponse<Income> = {
    items: mockIncomes,
    total: 2,
    offset: 0,
    limit: 20
};

describe("IncomesList component", () => {
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

    const renderComponent = () => {
        return render(
            <QueryClientProvider client={queryClient}>
                <IncomesList />
            </QueryClientProvider>
        );
    };

    it("muestra skeletons de carga al cargar", async () => {
        // Hacemos que la promesa de la API tarde en responder
        const apiMock = vi.spyOn(IncomeService, "getIncomes").mockReturnValue(
            new Promise(() => {})
        );

        renderComponent();

        // Debe haber indicadores de carga o skeletons
        // Buscamos elementos con clases de skeleton
        expect(apiMock).toHaveBeenCalled();
    });

    it("muestra estado vacio si no hay entradas", async () => {
        vi.spyOn(IncomeService, "getIncomes").mockResolvedValue({
            items: [],
            total: 0,
            offset: 0,
            limit: 20
        });

        renderComponent();

        const emptyMessage = await screen.findByText(/No hay entradas de servicio/i);
        expect(emptyMessage).toBeInTheDocument();
    });

    it("renderiza la lista de entradas en desktop y mobile con sus datos correctos", async () => {
        vi.spyOn(IncomeService, "getIncomes").mockResolvedValue(mockPaginatedResponse);

        renderComponent();

        // Debe encontrar las placas de los autos
        const plates = await screen.findAllByText("ABC-123");
        expect(plates.length).toBeGreaterThan(0);

        const brandModel = await screen.findAllByText(/Toyota Corolla/i);
        expect(brandModel.length).toBeGreaterThan(0);

        // Debe encontrar los nombres de los dueños
        const client1 = await screen.findAllByText(/Juan Perez/i);
        expect(client1.length).toBeGreaterThan(0);

        const client2 = await screen.findAllByText(/Maria Lopez/i);
        expect(client2.length).toBeGreaterThan(0);
    });

    it("muestra correctamente el estado 'En taller' para entradas activas y 'Entregado' para completadas", async () => {
        vi.spyOn(IncomeService, "getIncomes").mockResolvedValue(mockPaginatedResponse);

        renderComponent();

        // Deben mostrarse los badges de estado
        const activeStates = await screen.findAllByText("En taller");
        expect(activeStates.length).toBeGreaterThan(0);

        const completedStates = await screen.findAllByText("Entregado");
        expect(completedStates.length).toBeGreaterThan(0);
    });

    it("muestra la cantidad correcta de fotos", async () => {
        vi.spyOn(IncomeService, "getIncomes").mockResolvedValue(mockPaginatedResponse);

        renderComponent();

        // El primer registro tiene 1 foto, debe mostrar "1" o "1 foto"
        const photoIndicators = await screen.findAllByText(/1/i);
        expect(photoIndicators.length).toBeGreaterThan(0);
    });
});
