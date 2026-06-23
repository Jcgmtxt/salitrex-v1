import { apiClient } from "@/shared/api/client";
import type { 
    PricingCalculation, 
    PaintConfig, 
    PaintConfigCreate, 
    VehicleSizeArea, 
    VehicleSizeAreaCreate 
} from "../types";

export class PaintService {
    static async calculatePrice(carId: number): Promise<PricingCalculation> {
        const response = await apiClient.get<PricingCalculation>(`paint/calculate-price/${carId}`);
        return response.data;
    }

    static async getActiveConfig(): Promise<PaintConfig> {
        const response = await apiClient.get<PaintConfig>("paint/config");
        return response.data;
    }

    static async updateConfig(config: PaintConfigCreate): Promise<PaintConfig> {
        const response = await apiClient.post<PaintConfig>("paint/config", config);
        return response.data;
    }

    static async getVehicleAreas(): Promise<VehicleSizeArea[]> {
        const response = await apiClient.get<VehicleSizeArea[]>("paint/areas");
        return response.data;
    }

    static async updateVehicleArea(area: VehicleSizeAreaCreate): Promise<VehicleSizeArea> {
        const response = await apiClient.post<VehicleSizeArea>("paint/areas", area);
        return response.data;
    }
}
