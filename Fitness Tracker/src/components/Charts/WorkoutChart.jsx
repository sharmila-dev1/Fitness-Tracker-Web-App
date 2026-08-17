import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function WorkoutChart({ data }) {
  const { darkMode } = useTheme();
  const gridColor = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const textColor = darkMode ? '#6b7280' : '#9ca3af';

  const chartData = useMemo(() => ({
    labels: data.map((d) => d.day),
    datasets: [
      {
        label: 'Calories', 
        data: data.map((d) => d.calories),
        backgroundColor: '#ff6b35',
        borderRadius: 4,
        maxBarThickness: 28,
      },
      {
        label: 'Duration',
        data: data.map((d) => d.duration),
        backgroundColor: '#00d4ff',
        borderRadius: 4,
        maxBarThickness: 28,
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
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}${ctx.dataset.label === 'Duration' ? 'm' : ' cal'}`,
        },
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
      <Bar data={chartData} options={options} />
    </div>
  );
}