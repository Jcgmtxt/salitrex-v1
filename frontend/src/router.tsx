import {
    createRootRoute,
    createRoute,
    createRouter,
    Outlet,
} from "@tanstack/react-router";
import { Home } from "./pages/Home";

// Create the Root Route
const rootRoute = createRootRoute({
    component: () => (
        <>
            <Outlet />
        </>
    ),
});

// Create the Index Route
const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: Home,
});

// Create the route tree
const routeTree = rootRoute.addChildren([indexRoute]);

// Create the router instance
export const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}
