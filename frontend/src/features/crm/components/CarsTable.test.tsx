import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CarsTable } from "./CarsTable";
import type { Car } from "../types";

// Mock del router
vi.mock("@tanstack/react-router", () => ({
    useNavigate: () => vi.fn(),
}));

const mockCars: Car[] = [
    {
        id: 1,
        license_plate: "XYZ-987",
        brand: "Mazda",
        model: "3",
        year: 2021,
        color: "gris",
        size: "medium",
        client_id: 1,
        client_name: "Carlos Sanchez",
        created_at: "2026-05-23T10:00:00Z"
    },
    {
        id: 2,
        license_plate: "ABC-123",
        brand: "Chevrolet",
        model: "Onix",
        year: 2022,
        color: "rojo",
        size: "small",
        client_id: 2,
        client_name: "Ana Gomez",
        created_at: "2026-05-23T10:00:00Z"
    }
];

describe("CarsTable component", () => {
    it("renderiza las filas de autos correctamente", () => {
        render(<CarsTable cars={mockCars} />);

        expect(screen.getByText("XYZ-987")).toBeInTheDocument();
        expect(screen.getByText("ABC-123")).toBeInTheDocument();
        expect(screen.getByText("Mazda 3")).toBeInTheDocument();
        expect(screen.getByText("Chevrolet Onix")).toBeInTheDocument();
    });

    it("ordena por placa cuando se hace click en el header de Placa", () => {
        render(<CarsTable cars={mockCars} />);

        const cellsBefore = screen.getAllByRole("row").map(row => row.textContent);
        
        // Hacemos click en el header "Placa"
        const headerPlaca = screen.getByText(/Placa/i);
        fireEvent.click(headerPlaca);

        // El primer auto deberia ser ABC-123 (orden asc)
        const rows = screen.getAllByRole("row");
        // rows[0] es el header, rows[1] es la primera fila
        expect(rows[1].textContent).toContain("ABC-123");

        // Volvemos a hacer click (orden desc)
        fireEvent.click(headerPlaca);
        const rowsDesc = screen.getAllByRole("row");
        expect(rowsDesc[1].textContent).toContain("XYZ-987");
    });
});
