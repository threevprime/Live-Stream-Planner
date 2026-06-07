import { create } from "zustand";
import type { Settings } from "../types";
import { readJson, writeJson } from "../utils/fileStorage";
import { useFileSystemStore } from "./fileSystemStore";

function getHandle() {
    return useFileSystemStore.getState().dirHandle;
}

interface SettingsState {
    settings: Settings | null;
    fetch: () => Promise<void>;
    update: (data: Partial<Settings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
    settings: null,

    fetch: async () => {
        const handle = getHandle();
        if (!handle) return;
        const settings = await readJson<Settings>(handle, "settings.json");
        set({ settings });
    },

    update: async (data) => {
        const handle = getHandle();
        if (!handle) return;
        const updated = { ...get().settings!, ...data };
        await writeJson(handle, "settings.json", updated);
        set({ settings: updated });
    },
}));
