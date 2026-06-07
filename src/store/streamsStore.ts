import { create } from "zustand";
import type { Stream } from "../types";
import { readJson, writeJson } from "../utils/fileStorage";
import { useFileSystemStore } from "./fileSystemStore";

function getHandle() {
    return useFileSystemStore.getState().dirHandle;
}

interface StreamsState {
    streams: Stream[];
    loading: boolean;
    fetch: () => Promise<void>;
    create: (data: Omit<Stream, "id" | "createdAt">) => Promise<void>;
    update: (id: string, data: Partial<Stream>) => Promise<void>;
    remove: (id: string) => Promise<void>;
}

export const useStreamsStore = create<StreamsState>((set, get) => ({
    streams: [],
    loading: false,

    fetch: async () => {
        const handle = getHandle();
        if (!handle) return;
        set({ loading: true });
        const streams = await readJson<Stream[]>(handle, "streams.json");
        set({ streams, loading: false });
    },

    create: async (data) => {
        const handle = getHandle();
        if (!handle) return;
        const newStream: Stream = {
            ...data,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };
        const streams = [...get().streams, newStream];
        await writeJson(handle, "streams.json", streams);
        set({ streams });
    },

    update: async (id, data) => {
        const handle = getHandle();
        if (!handle) return;
        const streams = get().streams.map((s) => (s.id === id ? { ...s, ...data, id } : s));
        await writeJson(handle, "streams.json", streams);
        set({ streams });
    },

    remove: async (id) => {
        const handle = getHandle();
        if (!handle) return;
        const streams = get().streams.filter((s) => s.id !== id);
        await writeJson(handle, "streams.json", streams);
        set({ streams });
    },
}));
