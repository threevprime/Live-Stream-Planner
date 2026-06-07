import { create } from "zustand";
import { getSavedHandle, saveHandle, clearHandle } from "../utils/idb";
import { initSaveFolder, readJson, writeJson, SAVE_FOLDER_NAME } from "../utils/fileStorage";
import type { Settings } from "../types";

export type FSStatus =
    | "checking"
    | "needs-setup"
    | "needs-permission"
    | "needs-profile"
    | "ready"
    | "error";

const DISPLAY_PATH_KEY = "saveFolderDisplayPath";

interface FileSystemState {
    dirHandle: FileSystemDirectoryHandle | null;
    displayPath: string | null;
    status: FSStatus;
    error: string | null;
    init: () => Promise<void>;
    pickFolder: () => Promise<void>;
    requestPermission: () => Promise<void>;
    completeProfile: (streamerName: string, twitchUsername: string) => Promise<void>;
    changeFolder: () => Promise<void>;
    clearFolder: () => Promise<void>;
}

async function isNewSetup(handle: FileSystemDirectoryHandle): Promise<boolean> {
    try {
        const settings = await readJson<Settings>(handle, "settings.json");
        return !settings.streamerName;
    } catch {
        return true;
    }
}

export const useFileSystemStore = create<FileSystemState>((set, get) => ({
    dirHandle: null,
    displayPath: null,
    status: "checking",
    error: null,

    init: async () => {
        set({ status: "checking" });
        try {
            const handle = await getSavedHandle();
            if (!handle) {
                set({ status: "needs-setup" });
                return;
            }
            const perm = await handle.queryPermission({ mode: "readwrite" });
            if (perm === "granted") {
                set({
                    dirHandle: handle,
                    status: "ready",
                    displayPath: localStorage.getItem(DISPLAY_PATH_KEY),
                });
            } else {
                set({
                    dirHandle: handle,
                    status: "needs-permission",
                    displayPath: localStorage.getItem(DISPLAY_PATH_KEY),
                });
            }
        } catch {
            set({ status: "needs-setup" });
        }
    },

    pickFolder: async () => {
        try {
            const parentHandle = await window.showDirectoryPicker({ mode: "readwrite" });
            const dirHandle = await initSaveFolder(parentHandle);
            await saveHandle(dirHandle);
            const displayPath = `${parentHandle.name}/${SAVE_FOLDER_NAME}`;
            localStorage.setItem(DISPLAY_PATH_KEY, displayPath);

            const newSetup = await isNewSetup(dirHandle);
            set({
                dirHandle,
                displayPath,
                error: null,
                status: newSetup ? "needs-profile" : "ready",
            });
        } catch (e) {
            if ((e as DOMException).name !== "AbortError") {
                set({
                    error: "Something went wrong setting up the save folder. Please try again.",
                });
            }
        }
    },

    requestPermission: async () => {
        const { dirHandle } = get();
        if (!dirHandle) return;
        try {
            const perm = await dirHandle.requestPermission({ mode: "readwrite" });
            if (perm === "granted") {
                set({ status: "ready", error: null });
            } else {
                await clearHandle();
                localStorage.removeItem(DISPLAY_PATH_KEY);
                set({
                    dirHandle: null,
                    status: "needs-setup",
                    displayPath: null,
                    error: "Permission was denied. Please select your save folder again.",
                });
            }
        } catch {
            set({ error: "Could not request permission. Please try again." });
        }
    },

    completeProfile: async (streamerName, twitchUsername) => {
        const { dirHandle } = get();
        if (!dirHandle) return;
        try {
            const current = await readJson<Settings>(dirHandle, "settings.json");
            await writeJson(dirHandle, "settings.json", {
                ...current,
                streamerName,
                twitchUsername,
            });
            set({ status: "ready", error: null });
        } catch {
            set({ error: "Failed to save profile. Please try again." });
        }
    },

    changeFolder: async () => {
        await get().pickFolder();
    },

    clearFolder: async () => {
        await clearHandle();
        localStorage.removeItem(DISPLAY_PATH_KEY);
        set({ dirHandle: null, displayPath: null, status: "needs-setup", error: null });
    },
}));
