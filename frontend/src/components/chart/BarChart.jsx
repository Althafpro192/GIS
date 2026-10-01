// Horizontal bar chart Chart.js untuk data kecamatan.
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function BarChart({ labels, values, color = '#16a34a', label = 'Nilai', formatter }) {
  const data = {
    labels,
    datasets: [
      {
        label,
        data: values,
        backgroundColor: color + 'cc',
        borderColor: color,
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            formatter ? formatter(ctx.raw) : ctx.raw.toLocaleString('id-ID'),
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(0,0,0,0.04)' },
        ticks: { font: { size: 11, family: 'Inter' }, color: '#71717a' },
      },
      y: {
        grid: { display: false },
        ticks: { font: { size: 11, family: 'Inter' }, color: '#52525b' },
      },
    },
  }

  return <Bar data={data} options={options} />
}
