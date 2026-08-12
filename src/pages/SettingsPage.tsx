import { useApp } from '../contexts/AppContext';
import { Button } from '../components/Button';
import { Settings, RefreshCw, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SettingsPage() {
  const { config, setConfig, reanalyze, hasData } = useApp();
  const navigate = useNavigate();

  const handleReanalyze = () => {
    reanalyze();
    navigate('/analysis');
  };

  const handleClearData = () => {
    localStorage.removeItem('hidrometros-config');
    window.location.reload();
  };

  const styles = {
    container: { maxWidth: '800px', margin: '0 auto' },
    header: { marginBottom: '32px' },
    title: { fontSize: '32px', fontWeight: 700, color: '#fff', marginBottom: '8px' },
    subtitle: { color: '#94a3b8' },
    card: {
      background: 'rgba(30, 41, 59, 0.7)',
      backdropFilter: 'blur(12px)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      marginBottom: '24px',
    },
    cardTitle: {
      fontSize: '16px',
      fontWeight: 600,
      color: '#fff',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
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
    dangerZone: {
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
    },
    dangerTitle: {
      fontSize: '16px',
      fontWeight: 600,
      color: '#f87171',
      marginBottom: '12px',
    },
    dangerText: {
      color: '#94a3b8',
      fontSize: '14px',
      marginBottom: '16px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Configurações</h1>
        <p style={styles.subtitle}>Ajuste os limites e preferências da análise</p>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>
          <Settings size={20} color="#a78bfa" />
          Limites de Consumo
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
        </div>
      </div>

      {hasData && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            <RefreshCw size={20} color="#a78bfa" />
            Reanálise
          </h3>
          <p style={{ color: '#94a3b8', marginBottom: '16px', fontSize: '14px' }}>
            After changing limits, click to reanalyze the data.
          </p>
          <Button onClick={handleReanalyze} icon={RefreshCw}>
            Reanalisar com Novos Limites
          </Button>
        </div>
      )}

      <div style={{ ...styles.card, ...styles.dangerZone }}>
        <h3 style={styles.dangerTitle}>
          <Trash2 size={20} />
          Zona de Perigo
        </h3>
        <p style={styles.dangerText}>
          Isso vai limpar todas as configurações salvas e recarregar a página.
        </p>
        <Button variant="danger" onClick={handleClearData} icon={Trash2}>
          Limpar Configurações
        </Button>
      </div>
    </div>
  );
}
