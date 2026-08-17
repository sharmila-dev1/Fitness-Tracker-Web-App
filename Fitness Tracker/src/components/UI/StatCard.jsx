export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
}) {
  return (
    <div className="stat-card" style={{ "--card-accent": color }}>
      <div className="stat-card-header">
        <span className="stat-icon">{icon}</span>
        {trend !== undefined && (
          <span className={`stat-trend ${trend >= 0 ? "up" : "down"}`}>
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-title">{title}</div>
      {subtitle && <div className="stat-subtitle">{subtitle}</div>}
      <div className="stat-card-glow" />
    </div>
  );
}
