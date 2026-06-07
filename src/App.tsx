import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import SaveLocationModal from "./components/SaveLocationModal";
import Planner from "./pages/Planner";
import Reminders from "./pages/Reminders";
import DiscordSchedule from "./pages/DiscordSchedule";
import SettingsPage from "./pages/Settings";
import { useFileSystemStore } from "./store/fileSystemStore";
import "./styles/theme.css";
import "./styles/components.css";
import "./pages/pages.css";

export default function App() {
    const { status, init } = useFileSystemStore();

    useEffect(() => {
        init();
    }, [init]);

    if (status === "checking") {
        return (
            <div className="app-loading">
                <img src="/assets/logo.png" alt="Loading" className="app-loading-logo" />
            </div>
        );
    }

    if (status === "needs-setup" || status === "needs-permission") {
        return <SaveLocationModal />;
    }

    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Planner />} />
                    <Route path="/reminders" element={<Reminders />} />
                    <Route path="/discord" element={<DiscordSchedule />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}
