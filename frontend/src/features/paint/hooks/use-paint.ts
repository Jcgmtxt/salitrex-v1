import { useQuery } from "@tanstack/react-query";
import { PaintService } from "../api/paint.service";

export function useCalculatePrice(carId: number) {
    return useQuery({
        queryKey: ["paint", "calculate-price", carId],
        queryFn: () => PaintService.calculatePrice(carId),
        enabled: !isNaN(carId) && carId > 0,
    });
}
