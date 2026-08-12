import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { FileUpload } from '../components/FileUpload';
import { Button } from '../components/Button';
import { Settings, BarChart3 } from 'lucide-react';

export function UploadPage() {
  const { hasData, loading, error, parseFile, config, setConfig, analyze } = useApp();
  const navigate = useNavigate();

  const handleAnalyze = () => {
    analyze();
    navigate('/analysis');
  };

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto' },
    header: { marginBottom: '32px' },
    title: { fontSize: '32px', fontWeight: 700, color: '#fff', marginBottom: '8px' },
    subtitle: { color: '#94a3b8' },
    configPanel: {
      background: 'rgba(30, 41, 59, 0.7)',
      backdropFilter: 'blur(12px)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      marginBottom: '24px',
    },
    configRow: {
      display: 'flex',
      gap: '16px',
      alignItems: 'flex-end',
      flexWrap: 'wrap' as const,
    },
    inputGroup: { flex: 1, minWidth: '200px' },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: 500,
      color: '#94a3b8',
      marginBottom: '8px',
    },
    input: {
      width: '100%',
      padding: '10px 16px',
      borderRadius: '12px',
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(71, 85, 105, 0.5)',
      color: '#fff',
      fontSize: '14px',
      outline: 'none',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Carregar Planilha</h1>
        <p style={styles.subtitle}>Envie sua planilha Excel de hidrômetros</p>
      </div>

      <FileUpload onFileLoad={parseFile} loading={loading} error={error} />

      {hasData && (
        <div style={styles.configPanel}>
          <h3 style={{ color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={20} color="#a78bfa" />
            Configurações de Análise
          </h3>
          <div style={styles.configRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Limite Alto Consumo (m³)</label>
              <input
                type="number"
                value={config.highLimit}
                onChange={(e) => setConfig({ highLimit: Number(e.target.value) })}
                min="0"
                step="1"
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Limite Baixo Consumo (m³)</label>
              <input
                type="number"
                value={config.lowLimit}
                onChange={(e) => setConfig({ lowLimit: Number(e.target.value) })}
                min="0"
                step="0.5"
                style={styles.input}
              />
            </div>
            <Button onClick={handleAnalyze} icon={BarChart3}>
              Analisar Dados
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
