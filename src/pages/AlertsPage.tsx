import { useApp } from '../contexts/AppContext';
import { AlertsList } from '../components/AlertsList';
import { AlertTriangle } from 'lucide-react';

export function AlertsPage() {
  const { result, hasData } = useApp();

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto' },
    header: { marginBottom: '32px' },
    title: { fontSize: '32px', fontWeight: 700, color: '#fff', marginBottom: '8px' },
    subtitle: { color: '#94a3b8' },
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
      background: 'rgba(245, 158, 11, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
      color: '#fbbf24',
    },
  };

  if (!hasData || !result) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Alertas</h1>
          <p style={styles.subtitle}>Apartamentos com consumo anômalo</p>
        </div>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <AlertTriangle size={32} />
          </div>
          <p style={styles.emptyTitle}>Nenhum alerta para mostrar</p>
          <p>Carregue e analise uma planilha primeiro</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Alertas</h1>
        <p style={styles.subtitle}>
          {result.alerts.length} alertas detectados em {result.totalApartments} apartamentos
        </p>
      </div>

      <AlertsList alerts={result.alerts} />
    </div>
  );
}
