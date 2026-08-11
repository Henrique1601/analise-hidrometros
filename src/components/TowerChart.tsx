import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import type { TowerData } from '../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface TowerChartProps {
  towerData: TowerData;
}

export function TowerChart({ towerData }: TowerChartProps) {
  const chartData = useMemo(() => {
    const towerLabels = Object.keys(towerData).sort();
    const towerConsumption = towerLabels.map(t => towerData[t].average);

    return {
      labels: towerLabels,
      datasets: [{
        label: 'Consumo Médio (m³)',
        data: towerConsumption,
        backgroundColor: '#667eea',
        borderRadius: 5
      }]
    };
  }, [towerData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="chart-card">
      <h3>🏢 Consumo por Torre</h3>
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
