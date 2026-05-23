import { createFileRoute } from "@tanstack/react-router";
import { IncomeDetail } from "@/features/income/components/IncomeDetail";

export const Route = createFileRoute("/_authenticated/income/$incomeId")({
    component: () => {
        const { incomeId } = Route.useParams();
        return (
            <div className="flex flex-col w-full px-4 pt-4">
                <IncomeDetail incomeId={Number(incomeId)} />
            </div>
        );
    },
});
