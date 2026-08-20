import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

function makeGradient(hexColor) {
  return (context) => {
    const { ctx, chartArea } = context.chart;
    if (!chartArea) return null;
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, `${hexColor}4d`); // ~30% opacity
    gradient.addColorStop(1, `${hexColor}00`); // 0% opacity
    return gradient;
  };
}

export default function ProgressChart({ data }) {
  const { darkMode } = useTheme();
  const gridColor = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const textColor = darkMode ? '#6b7280' : '#9ca3af';

  const chartData = useMemo(() => ({
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: 'Weight (kg)',
        data: data.map((d) => d.weight),
        borderColor: '#00d4ff',
        backgroundColor: makeGradient('#00d4ff'),
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: '#00d4ff',
        pointHoverRadius: 6,
        tension: 0.35,
        fill: true,
      },
      {
        label: 'Body Fat %',
        data: data.map((d) => d.bodyFat),
        borderColor: '#ff6b35',
        backgroundColor: makeGradient('#ff6b35'),
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: '#ff6b35',
        pointHoverRadius: 6,
        tension: 0.35,
        fill: true,
      },
    ],
  }), [data]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: darkMode ? 'rgba(24,24,27,0.95)' : 'rgba(255,255,255,0.97)',
        titleColor: darkMode ? '#e5e7eb' : '#111827',
        bodyColor: darkMode ? '#e5e7eb' : '#111827',
        borderColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: textColor, font: { size: 12 } },
      },
      y: {
        grid: { color: gridColor, drawTicks: false },
        border: { display: false },
        ticks: { color: textColor, font: { size: 11 } },
      },
    },
  }), [darkMode, gridColor, textColor]);

  return (
    <div style={{ width: '100%', height: 220 }}>
      <Line data={chartData} options={options} />
    </div>
  );
}