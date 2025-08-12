import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function StockChart({ labels = [], prices = [], symbol }) {
  if (!labels.length) return <div className="empty">Select a company</div>;

  const data = {
    labels,
    datasets: [{
      label: `${symbol} Close`,
      data: prices,
      borderColor: 'blue',
      tension: 0.2,
      borderWidth: 2,
      pointRadius: 0
    }]
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: true } },
    scales: { x: { ticks: { maxTicksLimit: 10 } } }
  };

  return <Line data={data} options={options} />;
}
