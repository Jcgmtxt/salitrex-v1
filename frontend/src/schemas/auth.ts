import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "El email es requerido")
    .email("Formato de email inválido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export interface AuthResponse {
  access_token: string;
  token_type: string;
  name: string;
  email: string;
  role: "admin" | "operator";
}