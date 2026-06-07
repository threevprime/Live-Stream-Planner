import { join } from "path";

const DATA_DIR = join(import.meta.dir, "../data");

export async function readJson<T>(filename: string): Promise<T> {
    const path = join(DATA_DIR, filename);
    const file = Bun.file(path);
    return file.json() as Promise<T>;
}

export async function writeJson<T>(filename: string, data: T): Promise<void> {
    const path = join(DATA_DIR, filename);
    await Bun.write(path, JSON.stringify(data, null, 2));
}
