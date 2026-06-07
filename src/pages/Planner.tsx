import { useEffect, useState, type FormEvent } from "react";
import { useStreamsStore } from "../store/streamsStore";
import type { Stream, StreamStatus } from "../types";
import { toLocalInput } from "../utils/datetime";

const STATUS_OPTIONS: StreamStatus[] = ["planned", "live", "completed", "cancelled"];

const EMPTY: Omit<Stream, "id" | "createdAt"> = {
    title: "",
    startTime: "",
    durationMinutes: 180,
    game: "",
    description: "",
    status: "planned",
};

function formatDateTime(iso: string) {
    if (!iso) return "—";
    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(iso));
}

export default function Planner() {
    const { streams, loading, fetch, create, update, remove } = useStreamsStore();
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Stream | null>(null);
    const [form, setForm] = useState(EMPTY);
    const [filterStatus, setFilterStatus] = useState<StreamStatus | "all">("all");
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    useEffect(() => {
        fetch();
    }, [fetch]);

    function openCreate() {
        setEditing(null);
        setForm(EMPTY);
        setShowForm(true);
    }

    function openEdit(stream: Stream) {
        setEditing(stream);
        const { id: _id, createdAt: _ca, ...rest } = stream;
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

    const filtered =
        filterStatus === "all" ? streams : streams.filter((s) => s.status === filterStatus);

    const sorted = [...filtered].sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Stream Planner</h1>
                <button className="btn btn-primary" onClick={openCreate}>
                    + New Stream
                </button>
            </div>

            <div className="filter-bar">
                {(["all", ...STATUS_OPTIONS] as const).map((s) => (
                    <button
                        key={s}
                        className={`filter-btn${filterStatus === s ? " filter-btn--active" : ""}`}
                        onClick={() => setFilterStatus(s)}
                    >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                ))}
            </div>

            {loading ? (
                <p className="loading-text">Loading...</p>
            ) : sorted.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📅</div>
                    <p>No streams yet. Plan your first stream!</p>
                </div>
            ) : (
                <div className="stream-list">
                    {sorted.map((stream) => (
                        <div key={stream.id} className="card stream-card">
                            <div className="stream-card-header">
                                <div>
                                    <span className={`badge badge-${stream.status}`}>
                                        {stream.status}
                                    </span>
                                    <h3 className="stream-title">{stream.title}</h3>
                                    <p className="stream-meta">
                                        {formatDateTime(stream.startTime)} &middot;{" "}
                                        {stream.durationMinutes} min
                                        {stream.game ? ` · ${stream.game}` : ""}
                                    </p>
                                </div>
                                <div className="stream-card-actions">
                                    <button
                                        className="btn btn-ghost"
                                        onClick={() => openEdit(stream)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-ghost"
                                        onClick={() => setConfirmDelete(stream.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            {stream.description && (
                                <p className="stream-description">{stream.description}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">{editing ? "Edit Stream" : "New Stream"}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <label className="label">Title</label>
                                <input
                                    className="input"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="e.g. Rust Programming Session"
                                    required
                                />
                            </div>
                            <div className="form-row-2">
                                <div>
                                    <label className="label">Date & Time</label>
                                    <input
                                        className="input"
                                        type="datetime-local"
                                        value={toLocalInput(form.startTime)}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                startTime: new Date(e.target.value).toISOString(),
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Duration (minutes)</label>
                                    <input
                                        className="input"
                                        type="number"
                                        min={15}
                                        step={15}
                                        value={form.durationMinutes}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                durationMinutes: Number(e.target.value),
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="form-row-2">
                                <div>
                                    <label className="label">Game / Project</label>
                                    <input
                                        className="input"
                                        value={form.game}
                                        onChange={(e) => setForm({ ...form, game: e.target.value })}
                                        placeholder="e.g. Rust, React, Minecraft"
                                    />
                                </div>
                                <div>
                                    <label className="label">Status</label>
                                    <select
                                        className="input"
                                        value={form.status}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                status: e.target.value as StreamStatus,
                                            })
                                        }
                                    >
                                        {STATUS_OPTIONS.map((s) => (
                                            <option key={s} value={s}>
                                                {s.charAt(0).toUpperCase() + s.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <label className="label">Notes</label>
                                <textarea
                                    className="input"
                                    rows={3}
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm({ ...form, description: e.target.value })
                                    }
                                    placeholder="Stream notes, ideas, goals..."
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
                                    {editing ? "Save Changes" : "Create Stream"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {confirmDelete && (
                <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">Delete Stream?</h2>
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
