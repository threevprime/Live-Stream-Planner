import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Planner from "./pages/Planner";
import Reminders from "./pages/Reminders";
import DiscordSchedule from "./pages/DiscordSchedule";
import SettingsPage from "./pages/Settings";
import "./styles/theme.css";
import "./styles/components.css";
import "./pages/pages.css";

export default function App() {
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
