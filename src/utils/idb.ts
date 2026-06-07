const DB_NAME = "stream-planner";
const STORE = "handles";
const KEY = "saveDir";

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => req.result.createObjectStore(STORE);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

export async function getSavedHandle(): Promise<FileSystemDirectoryHandle | null> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readonly");
        const req = tx.objectStore(STORE).get(KEY);
        req.onsuccess = () => resolve((req.result as FileSystemDirectoryHandle) ?? null);
        req.onerror = () => reject(req.error);
    });
}

export async function saveHandle(handle: FileSystemDirectoryHandle): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readwrite");
        const req = tx.objectStore(STORE).put(handle, KEY);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
}

export async function clearHandle(): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readwrite");
        const req = tx.objectStore(STORE).delete(KEY);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
}
