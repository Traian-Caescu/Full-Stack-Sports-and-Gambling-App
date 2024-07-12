import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import './GamblingStatistics.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const barData = {
  labels: ['Losses', 'Wins'],
  datasets: [
    {
      label: 'Gambling Impact',
      data: [75, 25],
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
      ],
    },
  ],
};

const pieData = {
  labels: ['Losses', 'Break Even', 'Wins'],
  datasets: [
    {
      label: 'Outcome Distribution',
      data: [60, 20, 20],
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
      ],
    },
  ],
};

const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const GamblingStatistics = () => (
  <div className="gamblingStatistics">
    <h2>Understanding the Odds</h2>
    <div className="chartContainer">
      <Bar data={barData} options={options} />
      <Pie data={pieData} />
    </div>
  </div>
);

export default GamblingStatistics;
