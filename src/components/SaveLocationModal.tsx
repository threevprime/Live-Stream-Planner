import { useState } from "react";
import { useFileSystemStore } from "../store/fileSystemStore";
import { SAVE_FOLDER_NAME } from "../utils/fileStorage";
import "./SaveLocationModal.css";

export default function SaveLocationModal() {
    const { status, displayPath, error, pickFolder, requestPermission } = useFileSystemStore();
    const [loading, setLoading] = useState(false);

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

    const isPermissionPrompt = status === "needs-permission";

    return (
        <div className="sl-overlay">
            <div className="sl-modal">
                <img src="/assets/logo.png" alt="Stream Planning Manager" className="sl-logo" />

                {isPermissionPrompt ? (
                    <>
                        <h1 className="sl-title">Reconnect save folder</h1>
                        <p className="sl-desc">
                            Your save folder{" "}
                            {displayPath && <strong className="sl-path">{displayPath}</strong>}{" "}
                            needs permission to be accessed again. This is a browser security
                            requirement.
                        </p>
                        {error && <p className="sl-error">{error}</p>}
                        <button className="sl-btn" onClick={handleReconnect} disabled={loading}>
                            {loading ? "Connecting…" : "Reconnect Folder"}
                        </button>
                        <button className="sl-btn-ghost" onClick={pickFolder} disabled={loading}>
                            Choose a different folder
                        </button>
                    </>
                ) : (
                    <>
                        <h1 className="sl-title">Choose a save location</h1>
                        <p className="sl-desc">
                            Select a folder on your PC. The app will create a{" "}
                            <strong>{SAVE_FOLDER_NAME}</strong> subfolder inside it to store your
                            streams, reminders, and settings as JSON files.
                        </p>
                        <p className="sl-desc sl-desc--small">
                            Your data never leaves your machine — no accounts, no cloud.
                        </p>
                        {error && <p className="sl-error">{error}</p>}
                        <button className="sl-btn" onClick={handlePick} disabled={loading}>
                            {loading ? "Waiting…" : "Select Folder"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
