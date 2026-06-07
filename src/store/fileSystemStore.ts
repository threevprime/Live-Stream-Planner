import { create } from "zustand";
import { getSavedHandle, saveHandle, clearHandle } from "../utils/idb";
import { initSaveFolder, SAVE_FOLDER_NAME } from "../utils/fileStorage";

export type FSStatus = "checking" | "needs-setup" | "needs-permission" | "ready" | "error";

const DISPLAY_PATH_KEY = "saveFolderDisplayPath";

interface FileSystemState {
    dirHandle: FileSystemDirectoryHandle | null;
    displayPath: string | null;
    status: FSStatus;
    error: string | null;
    init: () => Promise<void>;
    pickFolder: () => Promise<void>;
    requestPermission: () => Promise<void>;
    changeFolder: () => Promise<void>;
    clearFolder: () => Promise<void>;
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
            set({ dirHandle, status: "ready", displayPath, error: null });
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

    changeFolder: async () => {
        await get().pickFolder();
    },

    clearFolder: async () => {
        await clearHandle();
        localStorage.removeItem(DISPLAY_PATH_KEY);
        set({ dirHandle: null, displayPath: null, status: "needs-setup", error: null });
    },
}));
