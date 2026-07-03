import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CarDetail } from "./CarDetail";
import { CRMService } from "../api/crm.service";
import { IncomeService } from "@/features/income/api/income.service";
import type { Car } from "../types";
import type { PaginatedResponse } from "@/shared/types/pagination";
import type { Income } from "@/features/income/types";

// Mock router link to prevent TanStack Router errors during test rendering
vi.mock("@tanstack/react-router", () => ({
    Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

const mockCar: Car = {
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
};

const mockIncomesResponse: PaginatedResponse<Income> = {
    items: [
        {
            id: 1,
            car_id: 10, // Belongs to this car
            income_date_time: "2026-05-23T10:00:00Z",
            exit_date_time: null,
            notes: "Golpe leve en puerta trasera derecha",
            photos: [],
            paint_jobs: [
                {
                    id: 1,
                    income_id: 1,
                    paint_type: "Metálico Premium",
                    base_price: 100000,
                    negotiated_price: 150000,
                    margin_percent: 33.3,
                    created_at: "2026-05-23T10:00:00Z",
                }
            ],
            notes_log: [
                {
                    id: 1,
                    income_id: 1,
                    note: "Preparado de superficie terminado",
                    created_at: "2026-05-23T12:00:00Z",
                    created_by: 2,
                    creator_name: "Operador Uno",
                }
            ],
            car: mockCar,
            created_at: "2026-05-23T10:00:00Z",
        },
        {
            id: 2,
            car_id: 99, // Belongs to a different car (should be filtered out)
            income_date_time: "2026-05-24T10:00:00Z",
            exit_date_time: "2026-05-26T18:00:00Z",
            notes: "Otro auto",
            photos: [],
            car: {
                id: 99,
                license_plate: "XYZ-987",
                brand: "Ford",
                model: "Fiesta",
                year: 2018,
                color: "azul",
                size: "small",
                client_id: 6,
                created_at: "2026-05-20T00:00:00Z"
            },
            created_at: "2026-05-24T10:00:00Z",
        }
    ],
    total: 2,
    offset: 0,
    limit: 20,
};

describe("CarDetail component", () => {
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

    const renderComponent = (carId = 10) => {
        return render(
            <QueryClientProvider client={queryClient}>
                <CarDetail carId={carId} />
            </QueryClientProvider>
        );
    };

    it("renderiza la informacion del vehiculo y del propietario correctamente", async () => {
        vi.spyOn(CRMService, "getCarById").mockResolvedValue(mockCar);
        vi.spyOn(IncomeService, "getIncomes").mockResolvedValue({ items: [], total: 0, offset: 0, limit: 20 });

        renderComponent();

        expect(await screen.findByText("Toyota Corolla")).toBeInTheDocument();
        expect(screen.getByText("ABC-123")).toBeInTheDocument();
        expect(screen.getByText("Mediano")).toBeInTheDocument();
        expect(screen.getByText("Juan Perez")).toBeInTheDocument();
    });

    it("renderiza la lista de ingresos del vehiculo y oculta los que pertenecen a otros autos", async () => {
        vi.spyOn(CRMService, "getCarById").mockResolvedValue(mockCar);
        vi.spyOn(IncomeService, "getIncomes").mockResolvedValue(mockIncomesResponse);

        renderComponent();

        expect(await screen.findByText("Toyota Corolla")).toBeInTheDocument();
        
        // Show income for this car
        expect(screen.getByText("Golpe leve en puerta trasera derecha")).toBeInTheDocument();
        expect(screen.getByText(/Preparado de superficie terminado/i)).toBeInTheDocument();
        expect(screen.getByText("Metálico Premium")).toBeInTheDocument();
        
        // Do NOT show income for another car
        expect(screen.queryByText("Golpe leve en puerta trasera derecha")).toBeInTheDocument();
        expect(screen.queryByText("Otro auto")).not.toBeInTheDocument();
    });

    it("muestra un estado vacio si el vehiculo no registra ningun ingreso", async () => {
        vi.spyOn(CRMService, "getCarById").mockResolvedValue(mockCar);
        vi.spyOn(IncomeService, "getIncomes").mockResolvedValue({ items: [], total: 0, offset: 0, limit: 20 });

        renderComponent();

        expect(await screen.findByText("Toyota Corolla")).toBeInTheDocument();
        expect(screen.getByText("Sin entradas registradas")).toBeInTheDocument();
        expect(screen.getByText(/no ha sido ingresado al taller/i)).toBeInTheDocument();
    });
});
