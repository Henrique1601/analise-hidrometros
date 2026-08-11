import { motion, AnimatePresence } from 'motion/react';
import { Filter, Download, Search } from 'lucide-react';
import type { WaterMeterData, FilterConfig, TowerData } from '../types';
import { exportAlerts } from '../utils/export';
import { Button } from './Button';
import clsx from 'clsx';

interface DataTableProps {
  data: WaterMeterData[];
  filter: FilterConfig;
  onFilterChange: (filter: Partial<FilterConfig>) => void;
  towerData: TowerData;
}

export function DataTable({ data, filter, onFilterChange, towerData }: DataTableProps) {
  const towers = Object.keys(towerData).sort();

  const handleExportAlerts = () => {
    const alerts = data
      .filter(item => item.statusClass === 'negative' || item.statusClass === 'high')
      .map(item => ({
        type: item.statusClass as 'negative' | 'high',
        message: `Torre ${item.torre} - Ap ${item.ap}: ${item.status} (${item.consumo.toFixed(2)} m³)`,
        tower: item.torre,
        ap: item.ap,
        value: item.consumo
      }));
    exportAlerts(alerts, 'alertas_hidrometros');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl border border-dark-700/50 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-dark-700/50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary-400" />
            Dados Detalhados
          </h3>

          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={handleExportAlerts}
          >
            Exportar Alertas
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'negative', label: '❌ Negativos' },
            { id: 'high', label: '⚠️ Alto Consumo' },
            { id: 'ok', label: '✅ OK' },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onFilterChange({ status: tab.id as FilterConfig['status'] })}
              className={clsx(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                filter.status === tab.id
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                  : 'text-dark-400 hover:text-white hover:bg-dark-700/50'
              )}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
            <input
              type="text"
              placeholder="Filtrar por apartamento..."
              value={filter.apartment}
              onChange={(e) => onFilterChange({ apartment: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-800/50 border border-dark-600 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500/50 transition-all"
            />
          </div>
          <select
            value={filter.tower}
            onChange={(e) => onFilterChange({ tower: e.target.value })}
            className="px-4 py-2.5 rounded-xl bg-dark-800/50 border border-dark-600 text-white focus:outline-none focus:border-primary-500/50 transition-all"
          >
            <option value="">Todas as Torres</option>
            {towers.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-700/50">
              <th className="text-left px-6 py-4 text-sm font-semibold text-dark-400">Torre</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-dark-400">Ap</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-dark-400">Índice Anterior</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-dark-400">Índice Atual</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-dark-400">Consumo (m³)</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-dark-400">Status</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {data.map((item, index) => (
                <motion.tr
                  key={`${item.torre}-${item.ap}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.02 }}
                  whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.05)' }}
                  className="border-b border-dark-700/30 cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <span className="font-medium text-white">{item.torre}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-dark-300">{item.ap}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-dark-300">{item.indiceAnterior.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-dark-300">{item.indiceAtual.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      'font-semibold',
                      item.consumo < 0 && 'text-red-400',
                      item.consumo > 20 && 'text-amber-400',
                      item.consumo >= 0 && item.consumo <= 20 && 'text-white'
                    )}>
                      {item.consumo.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      'px-3 py-1 rounded-full text-xs font-semibold',
                      item.statusClass === 'negative' && 'bg-red-500/20 text-red-400',
                      item.statusClass === 'high' && 'bg-amber-500/20 text-amber-400',
                      item.statusClass === 'ok' && 'bg-emerald-500/20 text-emerald-400'
                    )}>
                      {item.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {data.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-12 text-center"
        >
          <p className="text-dark-400">Nenhum dado encontrado</p>
        </motion.div>
      )}
    </motion.div>
  );
}
