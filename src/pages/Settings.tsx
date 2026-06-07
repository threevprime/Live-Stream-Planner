import { useEffect, useState, type FormEvent } from "react";
import { useSettingsStore } from "../store/settingsStore";
import type { Settings } from "../types";

const TIMEZONES = Intl.supportedValuesOf("timeZone");

export default function SettingsPage() {
    const { settings, fetch, update } = useSettingsStore();
    const [form, setForm] = useState<Settings | null>(null);
    const [saved, setSaved] = useState(false);

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

            <form onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
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
                            onChange={(e) => setForm({ ...form, twitchUsername: e.target.value })}
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
    );
}
