export default function ProgressRing({ percentage = 0, size = 80, strokeWidth = 7, color = "#00d4ff", label, value,}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const safePercentage = Number.isFinite(percentage) ? Math.min(100, Math.max(0, percentage)) : 0
    const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="progress-ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          // strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="pr0gress-ring-content">
        <span className="ring-value"> { value || `${Math.round(percentage)}%`}</span>
        {label && <span className="ring-label"> {label}</span>}
      </div>
    </div>
  );
}