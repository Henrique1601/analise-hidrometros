import { useState } from 'react';
import { useExcelParser } from '../hooks/useExcelParser';
import { useAnalysis } from '../hooks/useAnalysis';
import { FileUpload } from './FileUpload';
import { StatsCards } from './StatsCards';
import { ConsumptionChart } from './ConsumptionChart';
import { TowerChart } from './TowerChart';
import { AlertsList } from './AlertsList';
import { DataTable } from './DataTable';

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

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>💧 Análise de Hidrômetros</h1>
        <p>Carregue sua planilha Excel para detectar automaticamente consumo negativo e alto consumo</p>
      </header>

      {!showDashboard && (
        <FileUpload 
          onFileLoad={handleFileLoad} 
          loading={loading} 
          error={error}
        />
      )}

      {data.length > 0 && !showDashboard && (
        <div className="config-panel">
          <h3>⚙️ Configurações de Análise</h3>
          <div className="config-row">
            <div className="config-item">
              <label>Limite Alto Consumo (m³):</label>
              <input
                type="number"
                value={config.highLimit}
                onChange={(e) => setConfig({ highLimit: Number(e.target.value) })}
                min="0"
                step="1"
              />
            </div>
            <div className="config-item">
              <label>Limite Baixo Consumo (m³):</label>
              <input
                type="number"
                value={config.lowLimit}
                onChange={(e) => setConfig({ lowLimit: Number(e.target.value) })}
                min="0"
                step="0.5"
              />
            </div>
            <button className="analyze-btn" onClick={handleAnalyze}>
              🔍 Analisar Dados
            </button>
          </div>
        </div>
      )}

      {showDashboard && result && (
        <>
          <div className="config-panel">
            <h3>⚙️ Configurações de Análise</h3>
            <div className="config-row">
              <div className="config-item">
                <label>Limite Alto Consumo (m³):</label>
                <input
                  type="number"
                  value={config.highLimit}
                  onChange={(e) => setConfig({ highLimit: Number(e.target.value) })}
                  min="0"
                  step="1"
                />
              </div>
              <div className="config-item">
                <label>Limite Baixo Consumo (m³):</label>
                <input
                  type="number"
                  value={config.lowLimit}
                  onChange={(e) => setConfig({ lowLimit: Number(e.target.value) })}
                  min="0"
                  step="0.5"
                />
              </div>
              <button className="reanalyze-btn" onClick={handleReanalyze}>
                🔄 Reanalisar
              </button>
            </div>
          </div>

          <StatsCards result={result} />

          <div className="charts-row">
            <ConsumptionChart data={data} highLimit={config.highLimit} />
            <TowerChart towerData={result.towerData} />
          </div>

          <AlertsList alerts={result.alerts} />

          <DataTable 
            data={filteredData}
            filter={filter}
            onFilterChange={setFilter}
            towerData={result.towerData}
          />
        </>
      )}
    </div>
  );
}
