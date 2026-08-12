import { useApp } from '../contexts/AppContext';
import { DataTable } from '../components/DataTable';
import { FileSpreadsheet } from 'lucide-react';

export function ReportsPage() {
  const { filteredData, filter, setFilter, result, config, hasData } = useApp();

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
      background: 'rgba(59, 130, 246, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
      color: '#60a5fa',
    },
  };

  if (!hasData || !result) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Relatórios</h1>
          <p style={styles.subtitle}>Tabela detalhada com todos os dados</p>
        </div>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <FileSpreadsheet size={32} />
          </div>
          <p style={styles.emptyTitle}>Nenhum relatório disponível</p>
          <p>Carregue e analise uma planilha primeiro</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Relatórios</h1>
        <p style={styles.subtitle}>Tabela detalhada com todos os dados</p>
      </div>

      <DataTable
        data={filteredData}
        filter={filter}
        onFilterChange={setFilter}
        towerData={result.towerData}
        highLimit={config.highLimit}
        lowLimit={config.lowLimit}
      />
    </div>
  );
}
