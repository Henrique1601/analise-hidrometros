import { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { detectAnomalies, getZScoreColor, getAnomalyLabel } from '../utils/anomaly';
import { AlertTriangle } from 'lucide-react';

export function AnomalyPage() {
  const { data, hasData } = useApp();

  const anomalyResult = useMemo(() => {
    if (data.length === 0) return null;
    return detectAnomalies(data);
  }, [data]);

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto' },
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
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '16px',
      marginBottom: '24px',
    },
    statCard: {
      background: 'rgba(30, 41, 59, 0.5)',
      borderRadius: '12px',
      padding: '16px',
      textAlign: 'center' as const,
    },
    statLabel: { fontSize: '12px', color: '#94a3b8', marginBottom: '4px' },
    statValue: { fontSize: '20px', fontWeight: 700, color: '#fff' },
    outliersList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
      maxHeight: '400px',
      overflowY: 'auto' as const,
    },
    outlierItem: (zScore: number) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '10px',
      background: `${getZScoreColor(zScore)}10`,
      border: `1px solid ${getZScoreColor(zScore)}30`,
    }),
    outlierBadge: (zScore: number) => ({
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: 600,
      background: `${getZScoreColor(zScore)}20`,
      color: getZScoreColor(zScore),
    }),
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

  if (!hasData || !anomalyResult) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Detecção de Anomalias</h1>
          <p style={styles.subtitle}>Análise estatística avançada de consumo</p>
        </div>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <AlertTriangle size={32} />
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
        <h1 style={styles.title}>Detecção de Anomalias</h1>
        <p style={styles.subtitle}>Análise estatística avançada com desvio padrão e outliers</p>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Média</div>
          <div style={styles.statValue}>{anomalyResult.mean.toFixed(2)}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Desvio Padrão</div>
          <div style={styles.statValue}>{anomalyResult.stdDev.toFixed(2)}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Mediana</div>
          <div style={styles.statValue}>{anomalyResult.median.toFixed(2)}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Q1 (25%)</div>
          <div style={styles.statValue}>{anomalyResult.q1.toFixed(2)}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Q3 (75%)</div>
          <div style={styles.statValue}>{anomalyResult.q3.toFixed(2)}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>IQR</div>
          <div style={styles.statValue}>{anomalyResult.iqr.toFixed(2)}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Limite Inferior</div>
          <div style={{ ...styles.statValue, color: '#60a5fa' }}>{anomalyResult.lowerBound.toFixed(2)}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Limite Superior</div>
          <div style={{ ...styles.statValue, color: '#fbbf24' }}>{anomalyResult.upperBound.toFixed(2)}</div>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={{ color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={20} color="#fbbf24" />
          Outliers Detectados ({anomalyResult.outliers.length})
        </h3>

        {anomalyResult.outliers.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>
            Nenhum outlier estatístico detectado
          </p>
        ) : (
          <div style={styles.outliersList}>
            {anomalyResult.outliers
              .sort((a, b) => {
                const zA = anomalyResult.zScores.get(`${a.torre}-${a.ap}`) || 0;
                const zB = anomalyResult.zScores.get(`${b.torre}-${b.ap}`) || 0;
                return Math.abs(zB) - Math.abs(zA);
              })
              .map((item, index) => {
                const zScore = anomalyResult.zScores.get(`${item.torre}-${item.ap}`) || 0;
                return (
                  <div key={`${item.torre}-${item.ap}-${index}`} style={styles.outlierItem(zScore)}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, color: '#fff', marginBottom: '2px' }}>
                        Torre {item.torre} - Ap {item.ap}
                      </div>
                      <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                        Consumo: {item.consumo.toFixed(2)} m³
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={styles.outlierBadge(zScore)}>
                        {getAnomalyLabel(zScore)}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                        Z-Score: {zScore.toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
