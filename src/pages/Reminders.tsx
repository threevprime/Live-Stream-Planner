import { useEffect, useState, type FormEvent } from "react";
import { useRemindersStore } from "../store/remindersStore";
import type { Reminder, RepeatInterval } from "../types";
import { toLocalInput } from "../utils/datetime";

const EMPTY: Omit<Reminder, "id" | "createdAt"> = {
    title: "",
    dueAt: "",
    description: "",
    repeat: "none",
    repeatDays: undefined,
    done: false,
};

function relativeTime(iso: string) {
    const diff = new Date(iso).getTime() - Date.now();
    const abs = Math.abs(diff);
    const mins = Math.floor(abs / 60000);
    const hours = Math.floor(abs / 3600000);
    const days = Math.floor(abs / 86400000);
    const past = diff < 0;
    if (mins < 60) return `${past ? "" : "in "}${mins}m${past ? " ago" : ""}`;
    if (hours < 24) return `${past ? "" : "in "}${hours}h${past ? " ago" : ""}`;
    return `${past ? "" : "in "}${days}d${past ? " ago" : ""}`;
}

function formatDateTime(iso: string) {
    if (!iso) return "—";
    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(iso));
}

export default function Reminders() {
    const { reminders, loading, fetch, create, update, remove, markDone } = useRemindersStore();
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Reminder | null>(null);
    const [form, setForm] = useState(EMPTY);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    useEffect(() => {
        fetch();
    }, [fetch]);

    function openCreate() {
        setEditing(null);
        setForm(EMPTY);
        setShowForm(true);
    }

    function openEdit(reminder: Reminder) {
        setEditing(reminder);
        const { id: _id, createdAt: _ca, ...rest } = reminder;
        setForm(rest);
        setShowForm(true);
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (editing) {
            await update(editing.id, form);
        } else {
            await create(form);
        }
        setShowForm(false);
    }

    const pending = reminders
        .filter((r) => !r.done)
        .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
    const done = reminders.filter((r) => r.done);

    const overdue = pending.filter((r) => new Date(r.dueAt) < new Date());

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">
                    Reminders
                    {overdue.length > 0 && (
                        <span className="overdue-badge">{overdue.length} overdue</span>
                    )}
                </h1>
                <button className="btn btn-primary" onClick={openCreate}>
                    + New Reminder
                </button>
            </div>

            {loading ? (
                <p className="loading-text">Loading...</p>
            ) : pending.length === 0 && done.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">🔔</div>
                    <p>No reminders. Add one to stay on track!</p>
                </div>
            ) : (
                <>
                    {pending.length > 0 && (
                        <div className="reminder-list">
                            {pending.map((r) => {
                                const isOverdue = new Date(r.dueAt) < new Date();
                                return (
                                    <div
                                        key={r.id}
                                        className={`card reminder-card${isOverdue ? " reminder-card--overdue" : ""}`}
                                    >
                                        <div className="reminder-header">
                                            <div>
                                                <p className="reminder-title">{r.title}</p>
                                                <p className="reminder-time">
                                                    {formatDateTime(r.dueAt)}
                                                    <span
                                                        className={`relative-time${isOverdue ? " overdue" : ""}`}
                                                    >
                                                        {" "}
                                                        · {relativeTime(r.dueAt)}
                                                    </span>
                                                    {r.repeat !== "none" && (
                                                        <span className="repeat-badge">
                                                            {" "}
                                                            · repeats {r.repeat}
                                                        </span>
                                                    )}
                                                </p>
                                                {r.description && (
                                                    <p className="reminder-desc">{r.description}</p>
                                                )}
                                            </div>
                                            <div className="reminder-actions">
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => markDone(r.id)}
                                                >
                                                    Done
                                                </button>
                                                <button
                                                    className="btn btn-ghost"
                                                    onClick={() => openEdit(r)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-ghost"
                                                    onClick={() => setConfirmDelete(r.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {done.length > 0 && (
                        <details className="done-section">
                            <summary>Done ({done.length})</summary>
                            <div className="reminder-list" style={{ marginTop: 12 }}>
                                {done.map((r) => (
                                    <div
                                        key={r.id}
                                        className="card reminder-card reminder-card--done"
                                    >
                                        <div className="reminder-header">
                                            <div>
                                                <p className="reminder-title">{r.title}</p>
                                                <p className="reminder-time">
                                                    {formatDateTime(r.dueAt)}
                                                </p>
                                            </div>
                                            <div className="reminder-actions">
                                                <button
                                                    className="btn btn-ghost"
                                                    onClick={() => update(r.id, { done: false })}
                                                >
                                                    Undo
                                                </button>
                                                <button
                                                    className="btn btn-ghost"
                                                    onClick={() => setConfirmDelete(r.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </details>
                    )}
                </>
            )}

            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">
                            {editing ? "Edit Reminder" : "New Reminder"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <label className="label">Title</label>
                                <input
                                    className="input"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="e.g. Schedule next week's streams"
                                    required
                                />
                            </div>
                            <div className="form-row-2">
                                <div>
                                    <label className="label">Due Date & Time</label>
                                    <input
                                        className="input"
                                        type="datetime-local"
                                        value={toLocalInput(form.dueAt)}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                dueAt: new Date(e.target.value).toISOString(),
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Repeat</label>
                                    <select
                                        className="input"
                                        value={form.repeat}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                repeat: e.target.value as RepeatInterval,
                                            })
                                        }
                                    >
                                        <option value="none">No repeat</option>
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="custom">Custom</option>
                                    </select>
                                </div>
                            </div>
                            {form.repeat === "custom" && (
                                <div className="form-row">
                                    <label className="label">Repeat every (days)</label>
                                    <input
                                        className="input"
                                        type="number"
                                        min={1}
                                        value={form.repeatDays ?? 7}
                                        onChange={(e) =>
                                            setForm({ ...form, repeatDays: Number(e.target.value) })
                                        }
                                    />
                                </div>
                            )}
                            <div className="form-row">
                                <label className="label">Notes</label>
                                <textarea
                                    className="input"
                                    rows={3}
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm({ ...form, description: e.target.value })
                                    }
                                    placeholder="Optional details..."
                                />
                            </div>
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editing ? "Save Changes" : "Create Reminder"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {confirmDelete && (
                <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">Delete Reminder?</h2>
                        <p style={{ color: "var(--color-text-muted)", marginBottom: 24 }}>
                            This cannot be undone.
                        </p>
                        <div className="modal-actions">
                            <button
                                className="btn btn-ghost"
                                onClick={() => setConfirmDelete(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={async () => {
                                    await remove(confirmDelete);
                                    setConfirmDelete(null);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
