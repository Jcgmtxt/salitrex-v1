import { serve } from "bun";
import index from "./index.html";

const server = serve({
    routes: {
        // Serve index.html for all unmatched routes (SPA mode)
        "/*": index,
    },

    development: process.env.NODE_ENV !== "production" && {
        // Enable browser hot reloading
        hmr: true,
        // Echo console logs from the browser to the server terminal
        console: true,
    },
});

console.log(`🚀 Server running at ${server.url}`);
