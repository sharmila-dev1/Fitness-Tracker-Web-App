import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

export default function Sidebar() {
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: "⚡" },
    { path: "/workouts", label: "Workouts", icon: "🏋️" },
    { path: "/nutrition", label: "Nutrition", icon: "🥗" },
    { path: "/progress", label: "Progress", icon: "📈" },
  ];

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">💪</span>
        <div className="brand-text-wrap">
          <span className="brand-text"> Fitness Tracker</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-nav-item ${location.pathname === item.path ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {location.pathname === item.path && (
                <span className="active-indicator" />
              )}
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <button className="theme-toggle-btn" onClick={toggleDarkMode}>
          <span>{darkMode ? "☀️" : "🌙"}</span>
          <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>
        <div className="user-profile">
          <div className="user-avatar-lg">SH</div>
          <div className="user-info">
            <span className="user-name">Sharmila</span>
            <span className="user-plan">Pro Member</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
