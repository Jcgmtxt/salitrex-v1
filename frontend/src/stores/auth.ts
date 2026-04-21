import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthResponse } from "@/schemas/auth";

interface AuthState {
  token: string | null;
  user: Omit<AuthResponse, "access_token" | "refresh_token" | "token_type"> | null;
  isAuthenticated: boolean;
  setAuth: (auth: AuthResponse) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuth: (auth: AuthResponse) => {
        set({
          token: auth.access_token,
          user: {
            name: auth.name,
            email: auth.email,
            role: auth.role,
          },
          isAuthenticated: true,
        });
      },

      setToken: (token: string) => {
        set({ token, isAuthenticated: true });
      },

      clearAuth: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },

      initialize: () => {
        const state = get();
        set({ isAuthenticated: !!state.token });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);