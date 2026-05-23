import React from "react";
import type { Income } from "../types";

interface Props {
    income: Income;
    children: React.ReactNode;
}

export function EditIncomeDialog({ children }: Props) {
    return <>{children}</>;
}
