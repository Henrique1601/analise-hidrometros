import { Search, Download, Filter } from 'lucide-react';
import type { WaterMeterData, FilterConfig, TowerData } from '../types';
import { exportAlerts } from '../utils/export';

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

  const styles = {
    card: {
      background: 'rgba(30, 41, 59, 0.7)',
      backdropFilter: 'blur(12px)',
      borderRadius: '16px',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      overflow: 'hidden',
    },
    header: {
      padding: '24px',
      borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
    },
    headerTop: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between' as const,
      marginBottom: '16px',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    icon: {
      width: '20px',
      height: '20px',
      color: '#a78bfa',
    },
    title: {
      fontSize: '16px',
      fontWeight: 600,
      color: '#fff',
      margin: 0,
    },
    exportBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      borderRadius: '10px',
      border: '1px solid rgba(71, 85, 105, 0.5)',
      background: 'rgba(51, 65, 85, 0.5)',
      color: '#fff',
      fontSize: '13px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    tabs: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap' as const,
      marginBottom: '16px',
    },
    tab: (isActive: boolean) => ({
      padding: '8px 16px',
      borderRadius: '10px',
      fontSize: '13px',
      fontWeight: 500,
      border: isActive ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent',
      background: isActive ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
      color: isActive ? '#a78bfa' : '#94a3b8',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }),
    filters: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap' as const,
    },
    searchWrapper: {
      position: 'relative' as const,
      flex: 1,
      minWidth: '200px',
    },
    searchIcon: {
      position: 'absolute' as const,
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '16px',
      height: '16px',
      color: '#94a3b8',
    },
    searchInput: {
      width: '100%',
      padding: '10px 12px 10px 36px',
      borderRadius: '10px',
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(71, 85, 105, 0.5)',
      color: '#fff',
      fontSize: '13px',
      outline: 'none',
    },
    select: {
      padding: '10px 12px',
      borderRadius: '10px',
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(71, 85, 105, 0.5)',
      color: '#fff',
      fontSize: '13px',
      outline: 'none',
    },
    tableWrapper: {
      overflowX: 'auto' as const,
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const,
    },
    th: {
      textAlign: 'left' as const,
      padding: '14px 20px',
      fontSize: '12px',
      fontWeight: 600,
      color: '#94a3b8',
      borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
      background: 'rgba(30, 41, 59, 0.3)',
    },
    td: {
      padding: '14px 20px',
      fontSize: '14px',
      borderBottom: '1px solid rgba(148, 163, 184, 0.05)',
    },
    tr: {
      transition: 'background 0.2s',
    },
    statusBadge: (statusClass: string) => ({
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: 600,
      background: statusClass === 'negative' 
        ? 'rgba(239, 68, 68, 0.2)' 
        : statusClass === 'high' 
          ? 'rgba(245, 158, 11, 0.2)' 
          : 'rgba(16, 185, 129, 0.2)',
      color: statusClass === 'negative' 
        ? '#f87171' 
        : statusClass === 'high' 
          ? '#fbbf24' 
          : '#34d399',
    }),
    consumptionValue: (consumo: number) => ({
      fontWeight: 600,
      color: consumo < 0 ? '#f87171' : consumo > 20 ? '#fbbf24' : '#fff',
    }),
    emptyState: {
      padding: '48px 0',
      textAlign: 'center' as const,
      color: '#94a3b8',
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.headerLeft}>
            <Filter style={styles.icon} />
            <h3 style={styles.title}>Dados Detalhados</h3>
          </div>
          <button 
            style={styles.exportBtn}
            onClick={handleExportAlerts}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(71, 85, 105, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(51, 65, 85, 0.5)';
            }}
          >
            <Download size={14} />
            Exportar Alertas
          </button>
        </div>

        <div style={styles.tabs}>
          {[
            { id: 'all', label: 'Todos' },
            { id: 'negative', label: '❌ Negativos' },
            { id: 'high', label: '⚠️ Alto Consumo' },
            { id: 'ok', label: '✅ OK' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onFilterChange({ status: tab.id as FilterConfig['status'] })}
              style={styles.tab(filter.status === tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={styles.filters}>
          <div style={styles.searchWrapper}>
            <Search style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Filtrar por apartamento..."
              value={filter.apartment}
              onChange={(e) => onFilterChange({ apartment: e.target.value })}
              style={styles.searchInput}
            />
          </div>
          <select
            value={filter.tower}
            onChange={(e) => onFilterChange({ tower: e.target.value })}
            style={styles.select}
          >
            <option value="">Todas as Torres</option>
            {towers.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Torre</th>
              <th style={styles.th}>Ap</th>
              <th style={styles.th}>Índice Anterior</th>
              <th style={styles.th}>Índice Atual</th>
              <th style={styles.th}>Consumo (m³)</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={`${item.torre}-${item.ap}-${index}`}
                style={styles.tr}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(139, 92, 246, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <td style={styles.td}>
                  <span style={{ color: '#fff', fontWeight: 500 }}>{item.torre}</span>
                </td>
                <td style={styles.td}>
                  <span style={{ color: '#cbd5e1' }}>{item.ap}</span>
                </td>
                <td style={styles.td}>
                  <span style={{ color: '#cbd5e1' }}>{item.indiceAnterior.toFixed(2)}</span>
                </td>
                <td style={styles.td}>
                  <span style={{ color: '#cbd5e1' }}>{item.indiceAtual.toFixed(2)}</span>
                </td>
                <td style={styles.td}>
                  <span style={styles.consumptionValue(item.consumo)}>
                    {item.consumo.toFixed(2)}
                  </span>
                </td>
                <td style={styles.td}>
                  <span style={styles.statusBadge(item.statusClass)}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div style={styles.emptyState}>
          Nenhum dado encontrado
        </div>
      )}
    </div>
  );
}
