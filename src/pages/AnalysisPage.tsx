import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useApp } from '../contexts/AppContext';
import { ConsumptionChart } from '../components/ConsumptionChart';
import { TowerChart } from '../components/TowerChart';
import { Button } from '../components/Button';
import { BarChart3, FileText } from 'lucide-react';
import { generatePDF } from '../utils/pdf';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function AnalysisPage() {
  const { data, result, config, hasData } = useApp();

  const monthlyData = useMemo(() => {
    if (data.length === 0) return null;

    const towerConsumption: Record<string, number[]> = {};
    data.forEach(item => {
      if (!towerConsumption[item.torre]) {
        towerConsumption[item.torre] = [];
      }
      towerConsumption[item.torre].push(item.consumo);
    });

    return Object.entries(towerConsumption).map(([torre, consumos]) => ({
      torre,
      media: consumos.reduce((a, b) => a + b, 0) / consumos.length,
      total: consumos.reduce((a, b) => a + b, 0),
      count: consumos.length,
      max: Math.max(...consumos),
      min: Math.min(...consumos),
    }));
  }, [data]);

  const handleExportPDF = async () => {
    if (result) {
      await generatePDF(result, data, config);
    }
  };

  const chartData = useMemo(() => {
    if (!monthlyData) return null;

    const sorted = [...monthlyData].sort((a, b) => a.torre.localeCompare(b.torre));

    return {
      labels: sorted.map(d => `Torre ${d.torre}`),
      datasets: [
        {
          label: 'Média Consumo (m³)',
          data: sorted.map(d => d.media),
          backgroundColor: 'rgba(139, 92, 246, 0.8)',
          borderColor: 'rgb(139, 92, 246)',
          borderWidth: 2,
          borderRadius: 8,
        },
        {
          label: 'Máximo (m³)',
          data: sorted.map(d => d.max),
          backgroundColor: 'rgba(239, 68, 68, 0.6)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 2,
          borderRadius: 8,
        },
        {
          label: 'Mínimo (m³)',
          data: sorted.map(d => d.min),
          backgroundColor: 'rgba(16, 185, 129, 0.6)',
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 2,
          borderRadius: 8,
        },
      ]
    };
  }, [monthlyData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: '#94a3b8' }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(139, 92, 246, 0.3)',
        borderWidth: 1,
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
    container: { maxWidth: '1200px', margin: '0 auto' },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '32px',
    },
    title: { fontSize: '32px', fontWeight: 700, color: '#fff', marginBottom: '8px' },
    subtitle: { color: '#94a3b8' },
    chartsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '24px',
      marginBottom: '24px',
    },
    card: {
      background: 'rgba(30, 41, 59, 0.7)',
      backdropFilter: 'blur(12px)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      marginBottom: '24px',
    },
    chartContainer: { height: '300px' },
    emptyState: {
      textAlign: 'center' as const,
      padding: '80px 20px',
      color: '#94a3b8',
    },
    emptyIcon: {
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      background: 'rgba(139, 92, 246, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
      color: '#a78bfa',
    },
  };

  if (!hasData || !result) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Análise</h1>
            <p style={styles.subtitle}>Gráficos de consumo e distribuição por torre</p>
          </div>
        </div>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <BarChart3 size={32} />
          </div>
          <p style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>
            Nenhum dado para analisar
          </p>
          <p>Carregue e analise uma planilha primeiro</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Análise</h1>
          <p style={styles.subtitle}>Gráficos de consumo e distribuição por torre</p>
        </div>
        <Button onClick={handleExportPDF} icon={FileText}>
          Gerar PDF
        </Button>
      </div>

      <div style={styles.chartsRow}>
        <ConsumptionChart data={data} highLimit={config.highLimit} />
        <TowerChart towerData={result.towerData} />
      </div>

      {chartData && (
        <div style={styles.card}>
          <h3 style={{ color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={20} color="#a78bfa" />
            Consumo por Torre (Média, Máximo, Mínimo)
          </h3>
          <div style={styles.chartContainer}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
}
