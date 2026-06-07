import { create } from "zustand";
import type { Reminder } from "../types";
import { readJson, writeJson } from "../utils/fileStorage";
import { useFileSystemStore } from "./fileSystemStore";

function getHandle() {
    return useFileSystemStore.getState().dirHandle;
}

interface RemindersState {
    reminders: Reminder[];
    loading: boolean;
    fetch: () => Promise<void>;
    create: (data: Omit<Reminder, "id" | "createdAt">) => Promise<void>;
    update: (id: string, data: Partial<Reminder>) => Promise<void>;
    remove: (id: string) => Promise<void>;
    markDone: (id: string) => Promise<void>;
}

export const useRemindersStore = create<RemindersState>((set, get) => ({
    reminders: [],
    loading: false,

    fetch: async () => {
        const handle = getHandle();
        if (!handle) return;
        set({ loading: true });
        const reminders = await readJson<Reminder[]>(handle, "reminders.json");
        set({ reminders, loading: false });
    },

    create: async (data) => {
        const handle = getHandle();
        if (!handle) return;
        const newReminder: Reminder = {
            ...data,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };
        const reminders = [...get().reminders, newReminder];
        await writeJson(handle, "reminders.json", reminders);
        set({ reminders });
    },

    update: async (id, data) => {
        const handle = getHandle();
        if (!handle) return;
        const reminders = get().reminders.map((r) => (r.id === id ? { ...r, ...data, id } : r));
        await writeJson(handle, "reminders.json", reminders);
        set({ reminders });
    },

    remove: async (id) => {
        const handle = getHandle();
        if (!handle) return;
        const reminders = get().reminders.filter((r) => r.id !== id);
        await writeJson(handle, "reminders.json", reminders);
        set({ reminders });
    },

    markDone: async (id) => {
        const handle = getHandle();
        if (!handle) return;
        const reminders = get().reminders.map((r) => (r.id === id ? { ...r, done: true } : r));
        await writeJson(handle, "reminders.json", reminders);
        set({ reminders });
    },
}));
