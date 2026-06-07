import { readJson, writeJson } from "../storage";
import type { Reminder } from "../../src/types";

export async function handleReminders(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const segments = url.pathname.split("/").filter(Boolean);
    const id = segments[2];

    if (req.method === "GET" && !id) {
        const reminders = await readJson<Reminder[]>("reminders.json");
        return Response.json(reminders);
    }

    if (req.method === "POST") {
        const body = (await req.json()) as Omit<Reminder, "id" | "createdAt">;
        const reminders = await readJson<Reminder[]>("reminders.json");
        const newReminder: Reminder = {
            ...body,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };
        reminders.push(newReminder);
        await writeJson("reminders.json", reminders);
        return Response.json(newReminder, { status: 201 });
    }

    if (req.method === "PUT" && id) {
        const body = (await req.json()) as Partial<Reminder>;
        const reminders = await readJson<Reminder[]>("reminders.json");
        const idx = reminders.findIndex((r) => r.id === id);
        if (idx === -1) return new Response("Not found", { status: 404 });
        reminders[idx] = { ...reminders[idx]!, ...body, id };
        await writeJson("reminders.json", reminders);
        return Response.json(reminders[idx]);
    }

    if (req.method === "DELETE" && id) {
        const reminders = await readJson<Reminder[]>("reminders.json");
        const filtered = reminders.filter((r) => r.id !== id);
        if (filtered.length === reminders.length) return new Response("Not found", { status: 404 });
        await writeJson("reminders.json", filtered);
        return new Response(null, { status: 204 });
    }

    return new Response("Not found", { status: 404 });
}
