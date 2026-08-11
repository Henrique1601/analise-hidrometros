import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { BarChart3 } from 'lucide-react';
import type { WaterMeterData } from '../types';

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
        label: 'Apartamentos',
        data: counts,
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(148, 163, 184, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(52, 211, 153, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(148, 163, 184)',
          'rgb(16, 185, 129)',
          'rgb(52, 211, 153)',
          'rgb(245, 158, 11)',
          'rgb(249, 115, 22)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }]
    };
  }, [data, highLimit]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: false 
      },
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
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          color: '#94a3b8',
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          color: '#94a3b8',
          stepSize: 10,
        }
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6 border border-dark-700/50"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary-400" />
          Distribuição de Consumo
        </h3>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="h-64"
      >
        <Bar data={chartData} options={options} />
      </motion.div>
    </motion.div>
  );
}
