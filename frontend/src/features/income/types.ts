import type { Car } from "@/features/crm/types";

export type PhotoCategory = "entry" | "process" | "finished" | "exit";

export interface Photo {
    id: number;
    income_id: number;
    s3_key: string;
    category: PhotoCategory;
    presigned_url?: string;
}

export interface PaintJob {
    id: number;
    income_id: number;
    paint_type: string;
    base_price: number;
    negotiated_price: number;
    margin_percent: number;
    created_at: string;
}

export interface Income {
    id: number;
    car_id: number;
    income_date_time: string;
    agreed_exit_date_time?: string | null;
    exit_date_time?: string | null;
    notes?: string | null;
    photos: Photo[];
    paint_jobs?: PaintJob[];
    car?: Car | null;
    created_by?: number | null;
    created_at: string;
}
