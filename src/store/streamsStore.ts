import { create } from "zustand";
import type { Stream } from "../types";

interface StreamsState {
    streams: Stream[];
    loading: boolean;
    fetch: () => Promise<void>;
    create: (data: Omit<Stream, "id" | "createdAt">) => Promise<void>;
    update: (id: string, data: Partial<Stream>) => Promise<void>;
    remove: (id: string) => Promise<void>;
}

export const useStreamsStore = create<StreamsState>((set) => ({
    streams: [],
    loading: false,

    fetch: async () => {
        set({ loading: true });
        const res = await fetch("/api/streams");
        const streams = (await res.json()) as Stream[];
        set({ streams, loading: false });
    },

    create: async (data) => {
        const res = await fetch("/api/streams", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const newStream = (await res.json()) as Stream;
        set((s) => ({ streams: [...s.streams, newStream] }));
    },

    update: async (id, data) => {
        const res = await fetch(`/api/streams/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const updated = (await res.json()) as Stream;
        set((s) => ({
            streams: s.streams.map((stream) => (stream.id === id ? updated : stream)),
        }));
    },

    remove: async (id) => {
        await fetch(`/api/streams/${id}`, { method: "DELETE" });
        set((s) => ({ streams: s.streams.filter((stream) => stream.id !== id) }));
    },
}));
