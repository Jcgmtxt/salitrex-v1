import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthStore {
    token: string | null;
    name: string;
    email: string;
    role: 'admin' | 'operator' | '';
    setAuth: (data: { token: string; name: string; email: string; role: 'admin' | 'operator' }) => void;
    setToken: (token: string) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            token: null,
            name: '',
            email: '',
            role: '',

            setAuth: ({ token, name, email, role }) => {
                set({ token, name, email, role });
            },

            setToken: (token) => {
                set({ token });
            },

            clearAuth: () => {
                set({ token: null, name: '', email: '', role: '' });
                try {
                    localStorage.removeItem('auth-store');
                } catch {
                    //TODO: Agregar un log para saber el error
                    // Entorno sin localStorage (tests, SSR)
                }
            },
        }),
        {
            name: 'auth-store',
            // Persistimos todo el estado para no perder el rol al recargar
        },
    ),
);
