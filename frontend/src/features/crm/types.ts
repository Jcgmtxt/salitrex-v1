import { z } from "zod";

export interface Car {
    id: number;
    license_plate: string;
    brand: string;
    model: string;
    year: number;
    color: string;
    size: string;
    client_id: number;
    client_name?: string;
    created_at: string;
}

export interface Client {
    id: number;
    name: string;
    document_type: string;
    identity_number: string;
    email: string;
    phone: string;
    created_at: string;
    cars?: Car[];
}

export const DOCUMENT_TYPES = [
    { value: "cc", label: "Cédula de Ciudadanía" },
    { value: "ce", label: "Cédula de Extranjería" },
    { value: "nit", label: "NIT" },
    { value: "passport", label: "Pasaporte" },
] as const;

export const VEHICLE_SIZES = [
    { value: "small", label: "Pequeño" },
    { value: "medium", label: "Mediano" },
    { value: "large", label: "Grande" },
    { value: "extra_large", label: "Extra Grande" },
] as const;

// Schemas de Validación (Zod)

export const clientSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    document_type: z.enum(["cc", "ce", "nit", "passport"], {
        message: "Selecciona un tipo de documento valido",
    }),
    identity_number: z.string().min(3, "Mínimo 3 caracteres"),
    email: z
        .string()
        .email("Ingresa un correo válido")
        .or(z.literal(""))
        .optional(),
    phone: z.string().min(7, "El teléfono debe tener al menos 7 dígitos"),
});

export const carSchema = z.object({
    license_plate: z
        .string()
        .min(6, "La placa debe tener al menos 6 caracteres")
        .max(7, "La placa no puede superar 7 caracteres"),
    brand: z.string().min(2, "Mínimo 2 caracteres"),
    model: z.string().min(1, "Ingresa el modelo"),
    year: z.coerce
        .number()
        .min(1980, "Año mínimo: 1980")
        .max(new Date().getFullYear() + 1, "Año inválido"),
    color: z.string().min(2, "Mínimo 2 caracteres"),
    size: z.enum(["small", "medium", "large", "extra_large"], {
        message: "Selecciona un tamaño",
    }),
});

export type ClientInput = z.infer<typeof clientSchema>;
export type CarInput = z.infer<typeof carSchema>;

export type CreateCarPayload = CarInput & { client_id: number };
