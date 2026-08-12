import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/Button';
import { Upload, Trash2, BarChart3 } from 'lucide-react';
import { generatePeriodComparisonPDF } from '../utils/pdf';

export function ComparisonPage() {
  const { periods, addPeriod, removePeriod, clearPeriods } = useApp();
  const [loading, setLoading] = useState(false);

  const handleAddPeriod = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const name = prompt('Nome do periodo (ex: Janeiro 2024):');
    if (!name) return;

    setLoading(true);
    await addPeriod(file, name);
    setLoading(false);
    e.target.value = '';
  };

  const handleExportPDF = async () => {
    await generatePeriodComparisonPDF(periods);
  };

  const getComparison = () => {
    if (periods.length < 2) return null;

    const first = periods[0];
    const last = periods[periods.length - 1];

    const avgDiff = last.result.averageConsumption - first.result.averageConsumption;
    const totalDiff = last.result.totalConsumption - first.result.totalConsumption;
    const negativeDiff = last.result.negativeCount - first.result.negativeCount;
    const highDiff = last.result.highCount - first.result.highCount;

    return { first, last, avgDiff, totalDiff, negativeDiff, highDiff };
  };

  const comparison = getComparison();

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
    periodGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '16px',
      marginBottom: '24px',
    },
    periodCard: {
      background: 'rgba(30, 41, 59, 0.5)',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid rgba(148, 163, 184, 0.1)',
    },
    periodName: { fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '8px' },
    periodInfo: { fontSize: '13px', color: '#94a3b8', marginBottom: '4px' },
    periodStats: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '8px',
      marginTop: '12px',
    },
    statItem: { fontSize: '12px', color: '#94a3b8' },
    statValue: { fontSize: '14px', fontWeight: 600, color: '#fff' },
    comparisonGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
    },
    comparisonCard: {
      background: 'rgba(30, 41, 59, 0.5)',
      borderRadius: '12px',
      padding: '16px',
      textAlign: 'center' as const,
    },
    comparisonLabel: { fontSize: '12px', color: '#94a3b8', marginBottom: '8px' },
    comparisonValue: { fontSize: '24px', fontWeight: 700 },
    trendIcon: (positive: boolean) => ({
      color: positive ? '#10b981' : '#ef4444',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
    }),
    uploadArea: {
      border: '2px dashed rgba(139, 92, 246, 0.3)',
      borderRadius: '12px',
      padding: '24px',
      textAlign: 'center' as const,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    emptyState: {
      textAlign: 'center' as const,
      padding: '40px',
      color: '#94a3b8',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Comparativo entre Períodos</h1>
        <p style={styles.subtitle}>Compare o consumo de água entre diferentes meses</p>
      </div>

      <div style={styles.card}>
        <h3 style={{ color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Upload size={20} color="#a78bfa" />
          Adicionar Período
        </h3>
        <label style={styles.uploadArea}>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleAddPeriod}
            style={{ display: 'none' }}
            disabled={loading}
          />
          {loading ? (
            <p style={{ color: '#94a3b8' }}>Processando...</p>
          ) : (
            <p style={{ color: '#94a3b8' }}>Clique para selecionar planilha (.xlsx)</p>
          )}
        </label>
      </div>

      {periods.length > 0 && (
        <>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <Button onClick={handleExportPDF} icon={BarChart3}>
              Gerar PDF
            </Button>
            <Button variant="danger" onClick={clearPeriods} icon={Trash2}>
              Limpar Tudo
            </Button>
          </div>

          <div style={styles.periodGrid}>
            {periods.map(period => (
              <div key={period.id} style={styles.periodCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={styles.periodName}>{period.name}</div>
                    <div style={styles.periodInfo}>{period.fileName}</div>
                    <div style={styles.periodInfo}>{period.date.toLocaleDateString('pt-BR')}</div>
                  </div>
                  <button
                    onClick={() => removePeriod(period.id)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.2)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px',
                      cursor: 'pointer',
                      color: '#f87171',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div style={styles.periodStats}>
                  <div>
                    <div style={styles.statItem}>Apartamentos</div>
                    <div style={styles.statValue}>{period.result.totalApartments}</div>
                  </div>
                  <div>
                    <div style={styles.statItem}>Média</div>
                    <div style={styles.statValue}>{period.result.averageConsumption.toFixed(2)} m³</div>
                  </div>
                  <div>
                    <div style={styles.statItem}>Negativos</div>
                    <div style={{ ...styles.statValue, color: '#f87171' }}>{period.result.negativeCount}</div>
                  </div>
                  <div>
                    <div style={styles.statItem}>Altos</div>
                    <div style={{ ...styles.statValue, color: '#fbbf24' }}>{period.result.highCount}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {comparison && (
            <div style={styles.card}>
              <h3 style={{ color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart3 size={20} color="#a78bfa" />
                Comparação: {comparison.first.name} → {comparison.last.name}
              </h3>
              <div style={styles.comparisonGrid}>
                <div style={styles.comparisonCard}>
                  <div style={styles.comparisonLabel}>Média de Consumo</div>
                  <div style={{
                    ...styles.comparisonValue,
                    color: comparison.avgDiff > 0 ? '#f87171' : comparison.avgDiff < 0 ? '#10b981' : '#fff'
                  }}>
                    {comparison.avgDiff > 0 ? '+' : ''}{comparison.avgDiff.toFixed(2)} m³
                  </div>
                </div>
                <div style={styles.comparisonCard}>
                  <div style={styles.comparisonLabel}>Consumo Total</div>
                  <div style={{
                    ...styles.comparisonValue,
                    color: comparison.totalDiff > 0 ? '#f87171' : comparison.totalDiff < 0 ? '#10b981' : '#fff'
                  }}>
                    {comparison.totalDiff > 0 ? '+' : ''}{comparison.totalDiff.toFixed(2)} m³
                  </div>
                </div>
                <div style={styles.comparisonCard}>
                  <div style={styles.comparisonLabel}>Negativos</div>
                  <div style={{
                    ...styles.comparisonValue,
                    color: comparison.negativeDiff > 0 ? '#f87171' : comparison.negativeDiff < 0 ? '#10b981' : '#fff'
                  }}>
                    {comparison.negativeDiff > 0 ? '+' : ''}{comparison.negativeDiff}
                  </div>
                </div>
                <div style={styles.comparisonCard}>
                  <div style={styles.comparisonLabel}>Alto Consumo</div>
                  <div style={{
                    ...styles.comparisonValue,
                    color: comparison.highDiff > 0 ? '#f87171' : comparison.highDiff < 0 ? '#10b981' : '#fff'
                  }}>
                    {comparison.highDiff > 0 ? '+' : ''}{comparison.highDiff}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {periods.length === 0 && (
        <div style={styles.emptyState}>
          <p>Nenhum período carregado.</p>
          <p>Adicione planilhas para comparar o consumo entre meses.</p>
        </div>
      )}
    </div>
  );
}
