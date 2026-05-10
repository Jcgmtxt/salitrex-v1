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

export interface Car {
    id: number;
    license_plate: string;
    brand: string;
    model: string;
    year: number;
    color: string;
    size: string;
    client_id: number;
    created_at: string;
}

