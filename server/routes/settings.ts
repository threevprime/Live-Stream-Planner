import { readJson, writeJson } from "../storage";
import type { Settings } from "../../src/types";

export async function handleSettings(req: Request): Promise<Response> {
    if (req.method === "GET") {
        const settings = await readJson<Settings>("settings.json");
        return Response.json(settings);
    }

    if (req.method === "PUT") {
        const body = (await req.json()) as Partial<Settings>;
        const current = await readJson<Settings>("settings.json");
        const updated = { ...current, ...body };
        await writeJson("settings.json", updated);
        return Response.json(updated);
    }

    return new Response("Method not allowed", { status: 405 });
}
