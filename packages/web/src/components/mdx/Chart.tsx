import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import { Bar, Doughnut, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

// Palette that works in both light and dark mode
const PALETTE = [
  'rgba(99,  102, 241, 0.85)', // indigo
  'rgba(34,  197, 94,  0.85)', // green
  'rgba(249, 115, 22,  0.85)', // orange
  'rgba(236, 72,  153, 0.85)', // pink
  'rgba(20,  184, 166, 0.85)', // teal
  'rgba(168, 85,  247, 0.85)', // violet
  'rgba(250, 204, 21,  0.85)', // yellow
  'rgba(59,  130, 246, 0.85)', // blue
];

function useChartTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  return {
    gridColor:  isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
    textColor:  isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.50)',
    tickColor:  isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.50)',
  };
}

// ─── BarChart ──────────────────────────────────────────────────────────────────

interface BarChartProps {
  labels: string[];
  datasets: Array<{ label: string; data: number[]; color?: string }>;
  title?: string;
  horizontal?: boolean;
  height?: number;
}

export function BarChart({ labels, datasets, title, horizontal = false, height = 280 }: BarChartProps) {
  const theme = useChartTheme();

  const data: ChartData<'bar'> = {
    labels,
    datasets: datasets.map((d, i) => ({
      label: d.label,
      data: d.data,
      backgroundColor: d.color ?? PALETTE[i % PALETTE.length],
      borderRadius: 5,
      borderSkipped: false,
    })),
  };

  const options: ChartOptions<'bar'> = {
    indexAxis: horizontal ? 'y' : 'x',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: theme.textColor, boxWidth: 12, padding: 16 } },
      title: title ? { display: true, text: title, color: theme.textColor, font: { size: 13 }, padding: { bottom: 16 } } : { display: false },
    },
    scales: {
      x: { grid: { color: theme.gridColor }, ticks: { color: theme.tickColor } },
      y: { grid: { color: theme.gridColor }, ticks: { color: theme.tickColor } },
    },
  };

  return (
    <div className="not-prose my-6 rounded-xl border border-border bg-card p-5 shadow-sm" style={{ height }}>
      <Bar data={data} options={options} />
    </div>
  );
}

// ─── DonutChart ────────────────────────────────────────────────────────────────

interface DonutChartProps {
  labels: string[];
  data: number[];
  colors?: string[];
  title?: string;
  height?: number;
}

export function DonutChart({ labels, data, colors, title, height = 280 }: DonutChartProps) {
  const theme = useChartTheme();

  const chartData: ChartData<'doughnut'> = {
    labels,
    datasets: [{
      data,
      backgroundColor: colors ?? PALETTE.slice(0, data.length),
      borderWidth: 2,
      borderColor: 'transparent',
      hoverBorderColor: 'transparent',
      hoverOffset: 6,
    }],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      legend: { position: 'right', labels: { color: theme.textColor, boxWidth: 12, padding: 14 } },
      title: title ? { display: true, text: title, color: theme.textColor, font: { size: 13 }, padding: { bottom: 12 } } : { display: false },
    },
  };

  return (
    <div className="not-prose my-6 rounded-xl border border-border bg-card p-5 shadow-sm" style={{ height }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}

// ─── RadarChart ────────────────────────────────────────────────────────────────

interface RadarChartProps {
  labels: string[];
  datasets: Array<{ label: string; data: number[]; color?: string }>;
  title?: string;
  height?: number;
}

export function RadarChart({ labels, datasets, title, height = 320 }: RadarChartProps) {
  const theme = useChartTheme();

  const data: ChartData<'radar'> = {
    labels,
    datasets: datasets.map((d, i) => {
      const color = d.color ?? PALETTE[i % PALETTE.length];
      return {
        label: d.label,
        data: d.data,
        backgroundColor: color.replace('0.85', '0.15'),
        borderColor: color,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        borderWidth: 2,
        pointRadius: 3,
      };
    }),
  };

  const options: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: theme.textColor, boxWidth: 12, padding: 16 } },
      title: title ? { display: true, text: title, color: theme.textColor, font: { size: 13 }, padding: { bottom: 12 } } : { display: false },
    },
    scales: {
      r: {
        grid:       { color: theme.gridColor },
        angleLines: { color: theme.gridColor },
        pointLabels: { color: theme.textColor, font: { size: 12 } },
        ticks: { color: theme.tickColor, backdropColor: 'transparent', stepSize: 20 },
      },
    },
  };

  return (
    <div className="not-prose my-6 rounded-xl border border-border bg-card p-5 shadow-sm" style={{ height }}>
      <Radar data={data} options={options} />
    </div>
  );
}
