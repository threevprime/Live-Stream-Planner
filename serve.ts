import indexHtml from "./dist/index.html" with { type: "text" };

const PORT = 3001;
const BASE_URL = `http://localhost:${PORT}`;

console.log("╔═══════════════════════════════════╗");
console.log("║     Stream Planning Manager       ║");
console.log("╚═══════════════════════════════════╝");
console.log("");
console.log(`  Running at ${BASE_URL}`);
console.log("  Opening in your browser...");
console.log("");
console.log("  Keep this window open while using the app.");
console.log("  Close it to quit.");

Bun.spawn(["cmd", "/c", "start", BASE_URL]);

Bun.serve({
    port: PORT,
    fetch() {
        return new Response(indexHtml, {
            headers: { "Content-Type": "text/html; charset=utf-8" },
        });
    },
    error() {
        return new Response("Not found", { status: 404 });
    },
});
