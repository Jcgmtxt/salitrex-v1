import { LayoutDashboard, Users, Wrench, PaintBucket, Settings, Car, type LucideIcon } from "lucide-react";

export interface NavItem {
    name: string;
    to: '/dashboard' | '/clients' | '/cars' | '/income' | '/paint' | '/settings';
    icon: LucideIcon;
    roles: ("admin" | "operator")[];
}

export const NAVIGATION_ITEMS: NavItem[] = [
    { name: "Dashboard", to: "/dashboard", icon: LayoutDashboard, roles: ["admin", "operator"] },
    { name: "Clientes", to: "/clients", icon: Users, roles: ["admin", "operator"] },
    { name: "Vehiculos", to: "/cars", icon: Car, roles: ["admin", "operator"] },
    { name: "Entradas", to: "/income", icon: Wrench, roles: ["admin", "operator"] },
    { name: "Pintura", to: "/paint", icon: PaintBucket, roles: ["admin", "operator"] },
    { name: "Config", to: "/settings", icon: Settings, roles: ["admin"] },
];
