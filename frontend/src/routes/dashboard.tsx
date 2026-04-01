import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (!isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: Dashboard,
});

function Dashboard() {
  const user = useAuthStore((state) => state.user);
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Bienvenido, {user?.name}</p>
    </div>
  );
}