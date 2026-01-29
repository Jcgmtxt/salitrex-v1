export enum UserRole {
    ADMIN = "admin",
    OPERATOR = "operator",
}

export interface AuthUser {
    email: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    name: string;
    email: string;
    role: UserRole;
}
