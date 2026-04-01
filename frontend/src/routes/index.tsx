import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (isAuthenticated) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: Index,
});

function Index() {
  return null;
}