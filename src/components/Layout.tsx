import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import "./Layout.css";

const NAV_ITEMS = [
    { to: "/", label: "Planner", icon: "📅" },
    { to: "/reminders", label: "Reminders", icon: "🔔" },
    { to: "/discord", label: "Discord", icon: "💬" },
    { to: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <img src="/assets/logo.png" alt="Threev Prime" className="sidebar-logo" />
                </div>
                <nav className="sidebar-nav">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === "/"}
                            className={({ isActive }) =>
                                `nav-item${isActive ? " nav-item--active" : ""}`
                            }
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>
            <main className="main-content">{children}</main>
        </div>
    );
}
