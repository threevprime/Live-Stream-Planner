import { useEffect, useState, type FormEvent } from "react";
import { useSettingsStore } from "../store/settingsStore";
import { useFileSystemStore } from "../store/fileSystemStore";
import type { Settings } from "../types";

const TIMEZONES = Intl.supportedValuesOf("timeZone");

export default function SettingsPage() {
    const { settings, fetch, update } = useSettingsStore();
    const { displayPath, changeFolder, clearFolder } = useFileSystemStore();
    const [form, setForm] = useState<Settings | null>(null);
    const [saved, setSaved] = useState(false);
    const [confirmClear, setConfirmClear] = useState(false);

    useEffect(() => {
        fetch();
    }, [fetch]);

    useEffect(() => {
        if (settings && !form) setForm(settings);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings]);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!form) return;
        await update(form);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    }

    if (!form) return <p className="loading-text">Loading...</p>;

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Settings</h1>
            </div>

            <div style={{ maxWidth: 480 }}>
                <div className="card" style={{ padding: 24, marginBottom: 24 }}>
                    <h2 className="settings-section-title">Save Location</h2>
                    <p className="settings-path-label">Current folder</p>
                    <p className="settings-path">{displayPath ?? "—"}</p>
                    <div className="settings-folder-actions">
                        <button className="btn btn-ghost" onClick={changeFolder}>
                            Change Folder
                        </button>
                        {!confirmClear ? (
                            <button className="btn btn-ghost" onClick={() => setConfirmClear(true)}>
                                Forget Folder
                            </button>
                        ) : (
                            <span className="settings-confirm-row">
                                <span className="settings-confirm-text">Are you sure?</span>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => {
                                        clearFolder();
                                        setConfirmClear(false);
                                    }}
                                >
                                    Yes, forget it
                                </button>
                                <button
                                    className="btn btn-ghost"
                                    onClick={() => setConfirmClear(false)}
                                >
                                    Cancel
                                </button>
                            </span>
                        )}
                    </div>
                    <p className="settings-folder-hint">
                        Your data stays on your machine. Forgetting the folder does not delete any
                        files.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
                        <h2 className="settings-section-title">Streamer</h2>
                        <div className="form-row">
                            <label className="label">Display Name</label>
                            <input
                                className="input"
                                value={form.streamerName}
                                onChange={(e) => setForm({ ...form, streamerName: e.target.value })}
                            />
                        </div>
                        <div className="form-row">
                            <label className="label">Twitch Username</label>
                            <input
                                className="input"
                                value={form.twitchUsername}
                                onChange={(e) =>
                                    setForm({ ...form, twitchUsername: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
                        <h2 className="settings-section-title">Defaults</h2>
                        <div className="form-row">
                            <label className="label">Timezone</label>
                            <select
                                className="input"
                                value={form.timezone}
                                onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                            >
                                {TIMEZONES.map((tz) => (
                                    <option key={tz} value={tz}>
                                        {tz}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-row">
                            <label className="label">Default Stream Duration (minutes)</label>
                            <input
                                className="input"
                                type="number"
                                min={15}
                                step={15}
                                value={form.defaultDuration}
                                onChange={(e) =>
                                    setForm({ ...form, defaultDuration: Number(e.target.value) })
                                }
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary">
                        {saved ? "✓ Saved!" : "Save Settings"}
                    </button>
                </form>
            </div>
        </div>
    );
}
