import { handleStreams } from "./routes/streams";
import { handleReminders } from "./routes/reminders";
import { handleSettings } from "./routes/settings";

const PORT = 3001;

Bun.serve({
    port: PORT,
    async fetch(req) {
        const url = new URL(req.url);

        const corsHeaders = {
            "Access-Control-Allow-Origin": "http://localhost:5173",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        };

        if (req.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: corsHeaders });
        }

        let response: Response;

        if (url.pathname.startsWith("/api/streams")) {
            response = await handleStreams(req);
        } else if (url.pathname.startsWith("/api/reminders")) {
            response = await handleReminders(req);
        } else if (url.pathname.startsWith("/api/settings")) {
            response = await handleSettings(req);
        } else {
            response = new Response("Not found", { status: 404 });
        }

        for (const [key, value] of Object.entries(corsHeaders)) {
            response.headers.set(key, value);
        }

        return response;
    },
});

console.log(`API server running on http://localhost:${PORT}`);
