import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { WaterMeterData } from '../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ConsumptionChartProps {
  data: WaterMeterData[];
  highLimit: number;
}

export function ConsumptionChart({ data, highLimit }: ConsumptionChartProps) {
  const chartData = useMemo(() => {
    const ranges = ['< 0', '0', '1-5', '5-10', '10-15', `15-${highLimit}`, `> ${highLimit}`];
    const counts = [0, 0, 0, 0, 0, 0, 0];
    
    data.forEach(item => {
      if (item.consumo < 0) counts[0]++;
      else if (item.consumo === 0) counts[1]++;
      else if (item.consumo <= 5) counts[2]++;
      else if (item.consumo <= 10) counts[3]++;
      else if (item.consumo <= 15) counts[4]++;
      else if (item.consumo <= highLimit) counts[5]++;
      else counts[6]++;
    });

    return {
      labels: ranges,
      datasets: [{
        label: 'Quantidade de Apartamentos',
        data: counts,
        backgroundColor: [
          '#e74c3c',
          '#95a5a6',
          '#27ae60',
          '#2ecc71',
          '#f1c40f',
          '#e67e22',
          '#e74c3c'
        ],
        borderRadius: 5
      }]
    };
  }, [data, highLimit]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 10 }
      }
    }
  };

  return (
    <div className="chart-card">
      <h3>📈 Distribuição de Consumo</h3>
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
