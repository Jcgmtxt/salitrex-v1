export interface User {
    id: number;
    name: string;
    email: string;
    role: "admin" | "operator";
}

export interface UserCreate {
    name: string;
    email: string;
    password?: string;
    role: "admin" | "operator";
}

export interface UserUpdate {
    id: number;
    name: string;
    email: string;
    password?: string;
    role: "admin" | "operator";
}
