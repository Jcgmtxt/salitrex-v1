export type VehicleSize = "small" | "medium" | "large" | "extra_large";

export interface PricingCalculation {
    car_size: VehicleSize;
    area_cm2: number;
    price_per_cm2: number;
    base_price: number;
    min_allowed_price: number;
    min_margin_percent: number;
    target_allowed_price: number;
    target_margin_percent: number;
}

export interface PaintConfig {
    id: number;
    price_per_cm2: number;
    min_margin_percent: number;
    target_margin_percent: number;
    is_active: boolean;
    created_at: string;
}

export interface PaintConfigCreate {
    price_per_cm2: number;
    min_margin_percent: number;
    target_margin_percent: number;
    is_active: boolean;
}

export interface VehicleSizeArea {
    id: number;
    size: VehicleSize;
    area_cm2: number;
}

export interface VehicleSizeAreaCreate {
    size: VehicleSize;
    area_cm2: number;
}
