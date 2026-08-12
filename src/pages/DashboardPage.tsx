import { useApp } from '../contexts/AppContext';
import { StatCard } from '../components/StatCard';
import { 
  Building2, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle, 
  BarChart3 
} from 'lucide-react';

export function DashboardPage() {
  const { result, hasData } = useApp();

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto' },
    header: { marginBottom: '32px' },
    title: { fontSize: '32px', fontWeight: 700, color: '#fff', marginBottom: '8px' },
    subtitle: { color: '#94a3b8' },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '20px',
      marginBottom: '24px',
    },
    emptyState: {
      textAlign: 'center' as const,
      padding: '80px 20px',
      color: '#94a3b8',
    },
    emptyTitle: {
      fontSize: '20px',
      fontWeight: 600,
      color: '#fff',
      marginBottom: '8px',
    },
  };

  if (!hasData || !result) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>Visão geral do consumo de água</p>
        </div>
        <div style={styles.emptyState}>
          <p style={styles.emptyTitle}>Nenhum dado carregado</p>
          <p>Carregue uma planilha Excel para começar a análise</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
        <p style={styles.subtitle}>Visão geral do consumo de água</p>
      </div>

      <div style={styles.statsGrid}>
        <StatCard
          title="Total Apartamentos"
          value={result.totalApartments}
          icon={Building2}
          color="primary"
        />
        <StatCard
          title="Consumo Negativo"
          value={result.negativeCount}
          icon={AlertTriangle}
          color="danger"
        />
        <StatCard
          title="Alto Consumo"
          value={result.highCount}
          icon={TrendingUp}
          color="warning"
        />
        <StatCard
          title="Dentro do Normal"
          value={result.okCount + result.zeroCount + result.lowCount}
          icon={CheckCircle}
          color="success"
        />
        <StatCard
          title="Média Consumo"
          value={`${result.averageConsumption.toFixed(2)} m³`}
          icon={BarChart3}
          color="secondary"
        />
      </div>
    </div>
  );
}
