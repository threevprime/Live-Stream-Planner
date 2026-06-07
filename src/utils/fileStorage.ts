import type { Settings } from "../types";

export const SAVE_FOLDER_NAME = "Stream-Planning-SaveData";

const DEFAULTS: Record<string, unknown> = {
    "streams.json": [],
    "reminders.json": [],
    "settings.json": {
        streamerName: "",
        twitchUsername: "",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        defaultDuration: 180,
        discordMessageTemplate: "default",
    } satisfies Settings,
};

export async function initSaveFolder(
    parentHandle: FileSystemDirectoryHandle
): Promise<FileSystemDirectoryHandle> {
    const dirHandle = await parentHandle.getDirectoryHandle(SAVE_FOLDER_NAME, { create: true });
    for (const [filename, defaultValue] of Object.entries(DEFAULTS)) {
        try {
            await dirHandle.getFileHandle(filename);
        } catch {
            const fh = await dirHandle.getFileHandle(filename, { create: true });
            const w = await fh.createWritable();
            await w.write(JSON.stringify(defaultValue, null, 2));
            await w.close();
        }
    }
    return dirHandle;
}

export async function readJson<T>(
    dirHandle: FileSystemDirectoryHandle,
    filename: string
): Promise<T> {
    const fh = await dirHandle.getFileHandle(filename);
    const file = await fh.getFile();
    return JSON.parse(await file.text()) as T;
}

export async function writeJson<T>(
    dirHandle: FileSystemDirectoryHandle,
    filename: string,
    data: T
): Promise<void> {
    const fh = await dirHandle.getFileHandle(filename, { create: true });
    const w = await fh.createWritable();
    await w.write(JSON.stringify(data, null, 2));
    await w.close();
}
