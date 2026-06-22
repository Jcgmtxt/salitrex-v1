export type VehicleSize = "small" | "medium" | "large" | "extra_large";

export interface PricingCalculation {
    car_size: VehicleSize;
    area_cm2: number;
    price_per_cm2: number;
    base_price: number;
    min_allowed_price: number;
    min_margin_percent: number;
}
