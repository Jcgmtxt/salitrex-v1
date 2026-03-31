import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">SalitreX</h1>
      <p>Bienvenido a la aplicación</p>
    </div>
  );
}