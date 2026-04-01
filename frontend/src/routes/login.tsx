import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth";
import { LoginForm } from "@/forms/login";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (isAuthenticated) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: Login,
});

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">SalitreX</h1>
          <p className="text-muted-foreground">Ingresa tus credenciales para continuar</p>
        </div>
        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}