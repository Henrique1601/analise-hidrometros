import { useApp } from '../contexts/AppContext';
import { ConsumptionChart } from '../components/ConsumptionChart';
import { TowerChart } from '../components/TowerChart';
import { BarChart3 } from 'lucide-react';

export function AnalysisPage() {
  const { data, result, config, hasData } = useApp();

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto' },
    header: { marginBottom: '32px' },
    title: { fontSize: '32px', fontWeight: 700, color: '#fff', marginBottom: '8px' },
    subtitle: { color: '#94a3b8' },
    chartsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '24px',
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
          <h1 style={styles.title}>Análise</h1>
          <p style={styles.subtitle}>Gráficos de consumo e distribuição por torre</p>
        </div>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <BarChart3 size={32} />
          </div>
          <p style={styles.emptyTitle}>Nenhum dado para analisar</p>
          <p>Carregue e analise uma planilha primeiro</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Análise</h1>
        <p style={styles.subtitle}>Gráficos de consumo e distribuição por torre</p>
      </div>

      <div style={styles.chartsRow}>
        <ConsumptionChart data={data} highLimit={config.highLimit} />
        <TowerChart towerData={result.towerData} />
      </div>
    </div>
  );
}
