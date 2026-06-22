import { apiClient } from "@/shared/api/client";
import type { PricingCalculation } from "../types";

export class PaintService {
    static async calculatePrice(carId: number): Promise<PricingCalculation> {
        const response = await apiClient.get<PricingCalculation>(`paint/calculate-price/${carId}`);
        return response.data;
    }
}
