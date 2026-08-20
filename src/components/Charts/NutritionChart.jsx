import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import { useTheme } from "../../context/ThemeContext";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Filler,
);

const tooltipBase = (darkMode) => ({
  enabled: true,
  backgroundColor: darkMode ? "rgba(24,24,27,0.95)" : "rgba(255,255,255,0.97)",
  titleColor: darkMode ? "#e5e7eb" : "#111827",
  bodyColor: darkMode ? "#e5e7eb" : "#111827",
  borderColor: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
  borderWidth: 1,
  padding: 10,
  cornerRadius: 8,
  displayColors: true,
  mode: "index",
  intersect: false,
});

export function NutritionChart({ data, goal }) {
  const { darkMode } = useTheme();
  const gridColor = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const textColor = darkMode ? '#6b7280' : '#9ca3af';

  const chartData = useMemo(() => ({
    labels:data.map((d) => d.day),
    datasets: [
      {
        label: 'Goal',
        data: data.map(() => goal),
        borderColor: '#ff6b35',
        borderDash: [6, 3],
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: false,
        tension: 0,
      },
      {
        label: 'Calories',
        data: data.map((d) => d.calories),
        borderColor: '#34c759',
        backgroundColor: '#34c759',
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: '#34c759',
        pointHoverRadius: 6,
        tension: 0.35,
        fill: false,
      },
      {
        label: 'Protein (g)',
        data: data.map((d) => d.protein),
        borderColor: '#00d4ff',
        backgroundColor: '#00d4ff',
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: '#00d4ff',
        pointHoverRadius: 6,
        tension: 0.35,
        fill: false,
      }],
  }), [data, goal]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        ...tooltipBase(darkMode),
        filter: (item) => item.dataset.label !== 'Goal',
      }},
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: textColor, font: { size: 12 } },
      },
      y: {
        grid: { color: gridColor, drawTicks: false },
        border: { display: false },
        ticks: { color: textColor, font: { size: 11 } },
      }},
  }), [darkMode, gridColor, textColor]);

  return (
    <div style={{ width: '100%', height: 200 }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

export function MacroPieChart({ protein, carbs, fat }) {
  const data = [
    { name: 'Protein', value: protein * 4 },
    { name: 'Carbs', value: carbs * 4 },
    { name: 'Fat', value: fat * 9 },
  ];
  const COLORS = ['#00d4ff', '#ff6b35', '#ffcc00'];

  const chartData = useMemo(() => ({
    labels: data.map((d) => d.name),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: COLORS,
        borderWidth: 0,
      }],
  }), [protein, carbs, fat]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '64%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${Math.round(ctx.raw / 4)}g`,
        },
      }},
  }), []);

  return (
    <div style={{ width: '100%', height: 160 }}>
      <Pie data={chartData} options={options} />
    </div>
  );
}
