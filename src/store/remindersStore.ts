import { create } from "zustand";
import type { Reminder } from "../types";

interface RemindersState {
    reminders: Reminder[];
    loading: boolean;
    fetch: () => Promise<void>;
    create: (data: Omit<Reminder, "id" | "createdAt">) => Promise<void>;
    update: (id: string, data: Partial<Reminder>) => Promise<void>;
    remove: (id: string) => Promise<void>;
    markDone: (id: string) => Promise<void>;
}

export const useRemindersStore = create<RemindersState>((set) => ({
    reminders: [],
    loading: false,

    fetch: async () => {
        set({ loading: true });
        const res = await fetch("/api/reminders");
        const reminders = (await res.json()) as Reminder[];
        set({ reminders, loading: false });
    },

    create: async (data) => {
        const res = await fetch("/api/reminders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const newReminder = (await res.json()) as Reminder;
        set((s) => ({ reminders: [...s.reminders, newReminder] }));
    },

    update: async (id, data) => {
        const res = await fetch(`/api/reminders/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const updated = (await res.json()) as Reminder;
        set((s) => ({
            reminders: s.reminders.map((r) => (r.id === id ? updated : r)),
        }));
    },

    remove: async (id) => {
        await fetch(`/api/reminders/${id}`, { method: "DELETE" });
        set((s) => ({ reminders: s.reminders.filter((r) => r.id !== id) }));
    },

    markDone: async (id) => {
        const res = await fetch(`/api/reminders/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ done: true }),
        });
        const updated = (await res.json()) as Reminder;
        set((s) => ({
            reminders: s.reminders.map((r) => (r.id === id ? updated : r)),
        }));
    },
}));
