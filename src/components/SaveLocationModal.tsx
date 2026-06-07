import { useState } from "react";
import { useFileSystemStore } from "../store/fileSystemStore";
import { SAVE_FOLDER_NAME } from "../utils/fileStorage";
import "./SaveLocationModal.css";

export default function SaveLocationModal() {
    const { status, displayPath, error, pickFolder, requestPermission, completeProfile } =
        useFileSystemStore();
    const [loading, setLoading] = useState(false);

    // Profile step state
    const [streamerName, setStreamerName] = useState("");
    const [twitchUsername, setTwitchUsername] = useState("");

    async function handlePick() {
        setLoading(true);
        await pickFolder();
        setLoading(false);
    }

    async function handleReconnect() {
        setLoading(true);
        await requestPermission();
        setLoading(false);
    }

    async function handleProfile(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        await completeProfile(streamerName.trim(), twitchUsername.trim().replace(/^@/, ""));
        setLoading(false);
    }

    if (status === "needs-profile") {
        return (
            <div className="sl-overlay">
                <div className="sl-modal">
                    <img src="/assets/logo.png" alt="Stream Planning Manager" className="sl-logo" />
                    <h1 className="sl-title">One more thing</h1>
                    <p className="sl-desc">Set up your profile so the app knows who you are.</p>
                    {error && <p className="sl-error">{error}</p>}
                    <form onSubmit={handleProfile} className="sl-form">
                        <div className="sl-field">
                            <label className="sl-label">Display Name</label>
                            <input
                                className="sl-input"
                                placeholder="Threev Prime"
                                value={streamerName}
                                onChange={(e) => setStreamerName(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>
                        <div className="sl-field">
                            <label className="sl-label">Twitch Username</label>
                            <div className="sl-input-prefix-wrap">
                                <span className="sl-input-prefix">twitch.tv/</span>
                                <input
                                    className="sl-input sl-input--prefixed"
                                    placeholder="threevprime"
                                    value={twitchUsername}
                                    onChange={(e) =>
                                        setTwitchUsername(e.target.value.replace(/^@/, ""))
                                    }
                                    required
                                />
                            </div>
                        </div>
                        <button className="sl-btn" type="submit" disabled={loading}>
                            {loading ? "Saving…" : "Let's go!"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (status === "needs-permission") {
        return (
            <div className="sl-overlay">
                <div className="sl-modal">
                    <img src="/assets/logo.png" alt="Stream Planning Manager" className="sl-logo" />
                    <h1 className="sl-title">Reconnect save folder</h1>
                    <p className="sl-desc">
                        Your save folder{" "}
                        {displayPath && <strong className="sl-path">{displayPath}</strong>} needs
                        permission to be accessed again. This is a browser security requirement.
                    </p>
                    {error && <p className="sl-error">{error}</p>}
                    <button className="sl-btn" onClick={handleReconnect} disabled={loading}>
                        {loading ? "Connecting…" : "Reconnect Folder"}
                    </button>
                    <button className="sl-btn-ghost" onClick={pickFolder} disabled={loading}>
                        Choose a different folder
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="sl-overlay">
            <div className="sl-modal">
                <img src="/assets/logo.png" alt="Stream Planning Manager" className="sl-logo" />
                <h1 className="sl-title">Choose a save location</h1>
                <p className="sl-desc">
                    Select a folder on your PC. The app will create a{" "}
                    <strong>{SAVE_FOLDER_NAME}</strong> subfolder inside it to store your streams,
                    reminders, and settings as JSON files.
                </p>
                <p className="sl-desc sl-desc--small">
                    Your data never leaves your machine — no accounts, no cloud.
                </p>
                {error && <p className="sl-error">{error}</p>}
                <button className="sl-btn" onClick={handlePick} disabled={loading}>
                    {loading ? "Waiting…" : "Select Folder"}
                </button>
            </div>
        </div>
    );
}
