import { create } from "zustand";
import type { Settings } from "../types";

interface SettingsState {
    settings: Settings | null;
    fetch: () => Promise<void>;
    update: (data: Partial<Settings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
    settings: null,

    fetch: async () => {
        const res = await fetch("/api/settings");
        const settings = (await res.json()) as Settings;
        set({ settings });
    },

    update: async (data) => {
        const res = await fetch("/api/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const updated = (await res.json()) as Settings;
        set({ settings: updated });
    },
}));
