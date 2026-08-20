import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: "⚡" },
    { path: "/workouts", label: "Workouts", icon: "🏋️" },
    { path: "/nutrition", label: "Nutrition", icon: "🥗" },
    { path: "/progress", label: "Progress", icon: "📈" },
  ];

  return (
    <nav className="app-navbar">
      <div className="navbar-brand">
        <span className="brand-icon">💪</span>
        <span className="brand-text">Fitness Tracker</span>
      </div>
      <div className="nav-links">
        {navItems.map((item) => {
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link-item ${location.pathname === item.path ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="navbar-actions">
        <button
          className="theme-toggle"
          onClick={toggleDarkMode}
          title="Toggle theme"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
        <div className="user-avatar">
          <span> Fit</span>
        </div>
      </div>
    </nav>
  );
}
