import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-dark-400">
            Analise o consumo de água dos apartamentos de forma inteligente
          </p>
        </motion.div>

        {/* Upload Section */}
        <AnimatePresence mode="wait">
          {!showDashboard && (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <FileUpload 
                onFileLoad={handleFileLoad} 
                loading={loading} 
                error={error}
              />

              {/* Config Panel */}
              {data.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-2xl p-6 border border-dark-700/50"
                >
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                    <Settings className="w-5 h-5 text-primary-400" />
                    Configurações de Análise
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-dark-400 mb-2">
                        Limite Alto Consumo (m³)
                      </label>
                      <input
                        type="number"
                        value={config.highLimit}
                        onChange={(e) => setConfig({ highLimit: Number(e.target.value) })}
                        min="0"
                        step="1"
                        className="w-full px-4 py-2.5 rounded-xl bg-dark-800/50 border border-dark-600 text-white focus:outline-none focus:border-primary-500/50 transition-all"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-dark-400 mb-2">
                        Limite Baixo Consumo (m³)
                      </label>
                      <input
                        type="number"
                        value={config.lowLimit}
                        onChange={(e) => setConfig({ lowLimit: Number(e.target.value) })}
                        min="0"
                        step="0.5"
                        className="w-full px-4 py-2.5 rounded-xl bg-dark-800/50 border border-dark-600 text-white focus:outline-none focus:border-primary-500/50 transition-all"
                      />
                    </div>
                    <Button onClick={handleAnalyze} icon={BarChart3}>
                      Analisar Dados
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Section */}
        <AnimatePresence mode="wait">
          {showDashboard && result && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Config Panel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-6 border border-dark-700/50"
              >
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-dark-400 mb-2">
                      Limite Alto Consumo (m³)
                    </label>
                    <input
                      type="number"
                      value={config.highLimit}
                      onChange={(e) => setConfig({ highLimit: Number(e.target.value) })}
                      min="0"
                      step="1"
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-800/50 border border-dark-600 text-white focus:outline-none focus:border-primary-500/50 transition-all"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-dark-400 mb-2">
                      Limite Baixo Consumo (m³)
                    </label>
                    <input
                      type="number"
                      value={config.lowLimit}
                      onChange={(e) => setConfig({ lowLimit: Number(e.target.value) })}
                      min="0"
                      step="0.5"
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-800/50 border border-dark-600 text-white focus:outline-none focus:border-primary-500/50 transition-all"
                    />
                  </div>
                  <Button variant="secondary" onClick={handleReanalyze} icon={RefreshCw}>
                    Reanalisar
                  </Button>
                </div>
              </motion.div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ConsumptionChart data={data} highLimit={config.highLimit} />
                <TowerChart towerData={result.towerData} />
              </div>

              {/* Alerts */}
              <AlertsList alerts={result.alerts} />

              {/* Data Table */}
              <DataTable 
                data={filteredData}
                filter={filter}
                onFilterChange={setFilter}
                towerData={result.towerData}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
