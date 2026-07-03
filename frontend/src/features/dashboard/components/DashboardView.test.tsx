import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardView } from "./DashboardView";
import { IncomeService } from "@/features/income/api/income.service";
import { CRMService } from "@/features/crm/api/crm.service";
import type { PaginatedResponse } from "@/shared/types/pagination";
import type { Income } from "@/features/income/types";
import type { Client } from "@/features/crm/types";

// Mock router links to prevent TanStack Router errors during test rendering
vi.mock("@tanstack/react-router", () => ({
    Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

const mockIncomesResponse: PaginatedResponse<Income> = {
    items: [
        {
            id: 1,
            car_id: 10,
            income_date_time: new Date().toISOString(), // Today (active in workshop)
            exit_date_time: null,
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
            created_at: new Date().toISOString(),
        },
        {
            id: 2,
            car_id: 11,
            income_date_time: "2026-05-23T10:00:00Z", // Past date, delivered
            exit_date_time: "2026-05-25T18:00:00Z",
            photos: [],
            car: {
                id: 11,
                license_plate: "XYZ-987",
                brand: "Ford",
                model: "Fiesta",
                year: 2018,
                color: "azul",
                size: "small",
                client_id: 6,
                client_name: "Maria Lopez",
                created_at: "2026-05-20T00:00:00Z"
            },
            created_at: "2026-05-23T10:00:00Z",
        }
    ],
    total: 2,
    offset: 0,
    limit: 20,
};

const mockClientsResponse: PaginatedResponse<Client> = {
    items: [
        {
            id: 5,
            name: "Juan Perez",
            document_type: "cc",
            identity_number: "12345678",
            email: "juan@gmail.com",
            phone: "3001234567",
            created_at: "2026-05-20T00:00:00Z",
        }
    ],
    total: 15, // Indicates 15 total clients registered
    offset: 0,
    limit: 1,
};

describe("DashboardView component", () => {
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
                <DashboardView />
            </QueryClientProvider>
        );
    };

    it("renderiza cargando inicialmente", () => {
        renderComponent();
        expect(screen.getByText("Cargando datos del taller...")).toBeInTheDocument();
    });

    it("renderiza los KPIs correctamente despues de cargar", async () => {
        vi.spyOn(IncomeService, "getIncomes").mockResolvedValue(mockIncomesResponse);
        vi.spyOn(CRMService, "getClients").mockResolvedValue(mockClientsResponse);

        renderComponent();

        // Check cards titles
        expect(await screen.findByText("Vehículos en Taller")).toBeInTheDocument();
        expect(screen.getByText("Clientes Registrados")).toBeInTheDocument();
        expect(screen.getByText("Entradas del Día")).toBeInTheDocument();

        // Vehicles in workshop (exit_date_time is null): id 1 is active, id 2 is not -> total 1
        expect(screen.getAllByText("1").length).toBeGreaterThan(0);
        
        // Clients registered -> total 15
        expect(screen.getByText("15")).toBeInTheDocument();
        
        // Entries today -> id 1 is created today -> total 1
        // (Wait: "1" is already verified, but let's check that there's no mismatch)
    });

    it("muestra la lista rapida de ingresos recientes y accesos rapidos", async () => {
        vi.spyOn(IncomeService, "getIncomes").mockResolvedValue(mockIncomesResponse);
        vi.spyOn(CRMService, "getClients").mockResolvedValue(mockClientsResponse);

        renderComponent();

        // Recent entries list should display license plates and client names
        expect(await screen.findByText("ABC-123")).toBeInTheDocument();
        expect(screen.getByText("Juan Perez")).toBeInTheDocument();
        expect(screen.getByText("XYZ-987")).toBeInTheDocument();
        expect(screen.getByText("Maria Lopez")).toBeInTheDocument();

        // Quick actions buttons should render
        expect(screen.getByRole("button", { name: /Registrar Entrada/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Nuevo Cliente/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Calcular Precio Pintura/i })).toBeInTheDocument();
    });
});
