import type { Car } from "@/features/crm/types";

export type PhotoCategory = "entry" | "process" | "finished" | "exit";

export interface Photo {
    id: number;
    income_id: number;
    s3_key: string;
    category: PhotoCategory;
    presigned_url?: string;
}

export interface Income {
    id: number;
    car_id: number;
    income_date_time: string;
    agreed_exit_date_time?: string | null;
    exit_date_time?: string | null;
    notes?: string | null;
    photos: Photo[];
    car?: Car | null;
    created_by?: number | null;
    created_at: string;
}
