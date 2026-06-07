/**
 * Converts a UTC ISO string to the YYYY-MM-DDTHH:MM format that
 * datetime-local inputs expect (local time, not UTC).
 */
export function toLocalInput(iso: string): string {
    if (!iso) return "";
    const d = new Date(iso);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}
