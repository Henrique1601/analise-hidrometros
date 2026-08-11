import { useState } from 'react';
import { useExcelParser } from '../hooks/useExcelParser';
import { useAnalysis } from '../hooks/useAnalysis';
import { Layout } from './Layout';
import { FileUpload } from './FileUpload';
import { StatCard } from './StatCard';
import { ConsumptionChart } from './ConsumptionChart';
import { TowerChart } from './TowerChart';
import { AlertsList } from './AlertsList';
import { DataTable } from './DataTable';
import { Button } from './Button';
import { 
  Building2, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle, 
  BarChart3, 
  Settings,
  RefreshCw
} from 'lucide-react';

export function Dashboard() {
  const { data, loading, error, parseFile } = useExcelParser();
  const { result, filteredData, config, filter, setConfig, setFilter, analyze } = useAnalysis();
  const [showDashboard, setShowDashboard] = useState(false);

  const handleFileLoad = async (file: File) => {
    await parseFile(file);
  };

  const handleAnalyze = () => {
    if (data.length > 0) {
      analyze(data);
      setShowDashboard(true);
    }
  };

  const handleReanalyze = () => {
    if (data.length > 0) {
      analyze(data);
    }
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    header: {
      marginBottom: '32px',
    },
    title: {
      fontSize: '32px',
      fontWeight: 700,
      color: '#fff',
      marginBottom: '8px',
    },
    subtitle: {
      color: '#94a3b8',
    },
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
    inputGroup: {
      flex: 1,
      minWidth: '200px',
    },
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
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '20px',
      marginBottom: '24px',
    },
    chartsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '24px',
      marginBottom: '24px',
    },
    section: {
      marginBottom: '24px',
    },
  };

  return (
    <Layout>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>
            Analise o consumo de água dos apartamentos de forma inteligente
          </p>
        </div>

        {/* Upload Section */}
        {!showDashboard && (
          <>
            <FileUpload 
              onFileLoad={handleFileLoad} 
              loading={loading} 
              error={error}
            />

            {/* Config Panel */}
            {data.length > 0 && (
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
          </>
        )}

        {/* Dashboard Section */}
        {showDashboard && result && (
          <>
            {/* Config Panel */}
            <div style={styles.configPanel}>
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
                <Button variant="secondary" onClick={handleReanalyze} icon={RefreshCw}>
                  Reanalisar
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div style={styles.statsGrid}>
              <StatCard
                title="Total Apartamentos"
                value={result.totalApartments}
                icon={Building2}
                color="primary"
                delay={0}
              />
              <StatCard
                title="Consumo Negativo"
                value={result.negativeCount}
                icon={AlertTriangle}
                color="danger"
                delay={0.1}
              />
              <StatCard
                title="Alto Consumo"
                value={result.highCount}
                icon={TrendingUp}
                color="warning"
                delay={0.2}
              />
              <StatCard
                title="Dentro do Normal"
                value={result.okCount + result.zeroCount + result.lowCount}
                icon={CheckCircle}
                color="success"
                delay={0.3}
              />
              <StatCard
                title="Média Consumo"
                value={`${result.averageConsumption.toFixed(2)} m³`}
                icon={BarChart3}
                color="secondary"
                delay={0.4}
              />
            </div>

            {/* Charts Row */}
            <div style={styles.chartsRow}>
              <ConsumptionChart data={data} highLimit={config.highLimit} />
              <TowerChart towerData={result.towerData} />
            </div>

            {/* Alerts */}
            <div style={styles.section}>
              <AlertsList alerts={result.alerts} />
            </div>

            {/* Data Table */}
            <DataTable 
              data={filteredData}
              filter={filter}
              onFilterChange={setFilter}
              towerData={result.towerData}
            />
          </>
        )}
      </div>
    </Layout>
  );
}
