import { readJson, writeJson } from "../storage";
import type { Stream } from "../../src/types";

export async function handleStreams(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const segments = url.pathname.split("/").filter(Boolean);
    const id = segments[2];

    if (req.method === "GET" && !id) {
        const streams = await readJson<Stream[]>("streams.json");
        return Response.json(streams);
    }

    if (req.method === "POST") {
        const body = (await req.json()) as Omit<Stream, "id" | "createdAt">;
        const streams = await readJson<Stream[]>("streams.json");
        const newStream: Stream = {
            ...body,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };
        streams.push(newStream);
        await writeJson("streams.json", streams);
        return Response.json(newStream, { status: 201 });
    }

    if (req.method === "PUT" && id) {
        const body = (await req.json()) as Partial<Stream>;
        const streams = await readJson<Stream[]>("streams.json");
        const idx = streams.findIndex((s) => s.id === id);
        if (idx === -1) return new Response("Not found", { status: 404 });
        streams[idx] = { ...streams[idx]!, ...body, id };
        await writeJson("streams.json", streams);
        return Response.json(streams[idx]);
    }

    if (req.method === "DELETE" && id) {
        const streams = await readJson<Stream[]>("streams.json");
        const filtered = streams.filter((s) => s.id !== id);
        if (filtered.length === streams.length) return new Response("Not found", { status: 404 });
        await writeJson("streams.json", filtered);
        return new Response(null, { status: 204 });
    }

    return new Response("Not found", { status: 404 });
}
