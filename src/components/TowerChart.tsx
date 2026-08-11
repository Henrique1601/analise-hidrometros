import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Building2 } from 'lucide-react';
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
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }]
    };
  }, [towerData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(139, 92, 246, 0.3)',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { color: '#94a3b8' }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { color: '#94a3b8' }
      }
    }
  };

  const styles = {
    card: {
      background: 'rgba(30, 41, 59, 0.7)',
      backdropFilter: 'blur(12px)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(148, 163, 184, 0.1)',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '20px',
    },
    icon: {
      width: '20px',
      height: '20px',
      color: '#a78bfa',
    },
    title: {
      fontSize: '16px',
      fontWeight: 600,
      color: '#fff',
      margin: 0,
    },
    chartContainer: {
      height: '280px',
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <Building2 style={styles.icon} />
        <h3 style={styles.title}>Consumo por Torre</h3>
      </div>
      <div style={styles.chartContainer}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
