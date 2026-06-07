import { useEffect, useState } from "react";
import { useStreamsStore } from "../store/streamsStore";
import type { Stream } from "../types";

type TimestampFormat = "t" | "T" | "d" | "D" | "f" | "F" | "R";

function toDiscordTimestamp(iso: string, format: TimestampFormat = "F") {
    const unix = Math.floor(new Date(iso).getTime() / 1000);
    return `<t:${unix}:${format}>`;
}

function getWeekBounds(offset: number) {
    const now = new Date();
    const day = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((day + 6) % 7) + offset * 7);
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    return { start: monday, end: sunday };
}

function formatWeekLabel(start: Date, end: Date) {
    const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `${fmt(start)} – ${fmt(end)}`;
}

const GAME_EMOJIS: Record<string, string> = {
    rust: "🦀",
    react: "⚛️",
    typescript: "🔷",
    javascript: "🟨",
    python: "🐍",
    minecraft: "⛏️",
    default: "💻",
};

function gameEmoji(game: string) {
    const lower = game.toLowerCase();
    for (const [key, emoji] of Object.entries(GAME_EMOJIS)) {
        if (lower.includes(key)) return emoji;
    }
    return GAME_EMOJIS.default;
}

function generateMessage(streams: Stream[], intro: string, outro: string) {
    const lines: string[] = [];
    if (intro) lines.push(intro, "");
    lines.push("## 📅 Stream Schedule");
    lines.push("");

    for (const s of streams) {
        const emoji = gameEmoji(s.game || "");
        const timeF = toDiscordTimestamp(s.startTime, "F");
        const timeR = toDiscordTimestamp(s.startTime, "R");
        lines.push(`${emoji} **${s.title}**`);
        lines.push(`> ${timeF} (${timeR})`);
        if (s.game) lines.push(`> 🎮 ${s.game}`);
        if (s.description) lines.push(`> ${s.description}`);
        lines.push("");
    }

    if (outro) lines.push(outro);
    return lines.join("\n").trim();
}

export default function DiscordSchedule() {
    const { streams, fetch } = useStreamsStore();
    const [weekOffset, setWeekOffset] = useState(0);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [intro, setIntro] = useState("Hey chat! Here's what's on the schedule this week 🦊✨");
    const [outro, setOutro] = useState(
        "Follow on Twitch so you don't miss a stream! twitch.tv/threevprime"
    );
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetch();
    }, [fetch]);

    const { start, end } = getWeekBounds(weekOffset);
    const weekStreams = streams.filter((s) => {
        const t = new Date(s.startTime);
        return t >= start && t <= end && s.status !== "cancelled";
    });

    useEffect(() => {
        setSelected(new Set(weekStreams.map((s) => s.id)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [weekOffset, streams.length]);

    const chosenStreams = weekStreams
        .filter((s) => selected.has(s.id))
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    const message = generateMessage(chosenStreams, intro, outro);

    async function copy() {
        await navigator.clipboard.writeText(message);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function toggleStream(id: string) {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Discord Schedule</h1>
            </div>

            <div className="discord-layout">
                <div className="discord-config">
                    <div className="week-nav">
                        <button
                            className="btn btn-ghost"
                            onClick={() => setWeekOffset((o) => o - 1)}
                        >
                            ← Prev
                        </button>
                        <span className="week-label">{formatWeekLabel(start, end)}</span>
                        <button
                            className="btn btn-ghost"
                            onClick={() => setWeekOffset((o) => o + 1)}
                        >
                            Next →
                        </button>
                    </div>

                    <div className="section-block">
                        <p className="label">Streams this week</p>
                        {weekStreams.length === 0 ? (
                            <p className="empty-inline">No streams planned for this week.</p>
                        ) : (
                            <div className="stream-checklist">
                                {weekStreams.map((s) => (
                                    <label key={s.id} className="checklist-item">
                                        <input
                                            type="checkbox"
                                            checked={selected.has(s.id)}
                                            onChange={() => toggleStream(s.id)}
                                        />
                                        <span>
                                            {s.title}
                                            <span className="checklist-time">
                                                {" "}
                                                ·{" "}
                                                {new Date(s.startTime).toLocaleString("en-US", {
                                                    weekday: "short",
                                                    hour: "numeric",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="section-block">
                        <label className="label">Intro message</label>
                        <textarea
                            className="input"
                            rows={2}
                            value={intro}
                            onChange={(e) => setIntro(e.target.value)}
                        />
                    </div>

                    <div className="section-block">
                        <label className="label">Outro message</label>
                        <textarea
                            className="input"
                            rows={2}
                            value={outro}
                            onChange={(e) => setOutro(e.target.value)}
                        />
                    </div>
                </div>

                <div className="discord-preview">
                    <div className="preview-header">
                        <p className="label">Preview</p>
                        <button
                            className="btn btn-primary"
                            onClick={copy}
                            disabled={chosenStreams.length === 0}
                        >
                            {copied ? "✓ Copied!" : "Copy to Clipboard"}
                        </button>
                    </div>
                    <pre className="message-preview">{message || "No streams selected."}</pre>
                </div>
            </div>
        </div>
    );
}
