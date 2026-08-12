import { useState, useMemo } from 'react';
import { Search, Download, Filter, ChevronUp, ChevronDown, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { WaterMeterData, FilterConfig, TowerData } from '../types';
import { exportAlerts, exportToCSV } from '../utils/export';
import { PAGINATION } from '../constants';

interface DataTableProps {
  data: WaterMeterData[];
  filter: FilterConfig;
  onFilterChange: (filter: Partial<FilterConfig>) => void;
  towerData: TowerData;
  highLimit: number;
  lowLimit: number;
}

type SortField = 'torre' | 'ap' | 'indiceAnterior' | 'indiceAtual' | 'consumo' | 'status';
type SortDirection = 'asc' | 'desc';

export function DataTable({ data, filter, onFilterChange, towerData, highLimit, lowLimit }: DataTableProps) {
  const towers = Object.keys(towerData).sort();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(PAGINATION.DEFAULT_PAGE_SIZE);
  const [sortField, setSortField] = useState<SortField>('torre');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      switch (sortField) {
        case 'torre': aVal = a.torre; bVal = b.torre; break;
        case 'ap': aVal = a.ap; bVal = b.ap; break;
        case 'indiceAnterior': aVal = a.indiceAnterior; bVal = b.indiceAnterior; break;
        case 'indiceAtual': aVal = a.indiceAtual; bVal = b.indiceAtual; break;
        case 'consumo': aVal = a.consumo; bVal = b.consumo; break;
        case 'status': aVal = a.status; bVal = b.status; break;
        default: return 0;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDirection === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    return sorted;
  }, [data, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

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

  const handleExportAll = () => {
    exportToCSV(data, 'dados_completos_hidrometros');
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp size={14} style={{ opacity: 0.3 }} />;
    return sortDirection === 'asc' 
      ? <ChevronUp size={14} style={{ color: '#a78bfa' }} />
      : <ChevronDown size={14} style={{ color: '#a78bfa' }} />;
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
      cursor: 'pointer',
      userSelect: 'none' as const,
      whiteSpace: 'nowrap' as const,
    },
    td: {
      padding: '14px 20px',
      fontSize: '14px',
      borderBottom: '1px solid rgba(148, 163, 184, 0.05)',
    },
    tr: {
      transition: 'background 0.2s',
    },
    statusBadge: (statusClass: string, status: string) => {
      let bg: string;
      let color: string;

      if (statusClass === 'negative') {
        bg = 'rgba(239, 68, 68, 0.2)';
        color = '#f87171';
      } else if (statusClass === 'high') {
        bg = 'rgba(245, 158, 11, 0.2)';
        color = '#fbbf24';
      } else if (status === 'ZERO') {
        bg = 'rgba(148, 163, 184, 0.2)';
        color = '#94a3b8';
      } else if (status === 'BAIXO') {
        bg = 'rgba(253, 230, 138, 0.2)';
        color = '#fde68a';
      } else {
        bg = 'rgba(16, 185, 129, 0.2)';
        color = '#34d399';
      }

      return { display: 'inline-block', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: bg, color };
    },
    consumptionValue: (consumo: number) => ({
      fontWeight: 600,
      color: consumo < 0 ? '#f87171' : consumo > highLimit ? '#fbbf24' : consumo < lowLimit && consumo > 0 ? '#fde68a' : '#fff',
    }),
    emptyState: {
      padding: '48px 0',
      textAlign: 'center' as const,
      color: '#94a3b8',
    },
    pagination: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between' as const,
      padding: '16px 24px',
      borderTop: '1px solid rgba(148, 163, 184, 0.1)',
    },
    paginationInfo: {
      fontSize: '13px',
      color: '#94a3b8',
    },
    paginationControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    pageBtn: (isActive: boolean) => ({
      padding: '6px 12px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '13px',
      fontWeight: 500,
      cursor: 'pointer',
      background: isActive ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
      color: isActive ? '#a78bfa' : '#94a3b8',
      transition: 'all 0.2s',
    }),
    navBtn: {
      padding: '6px 8px',
      borderRadius: '8px',
      border: 'none',
      background: 'transparent',
      color: '#94a3b8',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    pageSizeSelect: {
      padding: '6px 12px',
      borderRadius: '8px',
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(71, 85, 105, 0.5)',
      color: '#fff',
      fontSize: '13px',
      outline: 'none',
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.headerLeft}>
            <Filter style={styles.icon} />
            <h3 style={styles.title}>Dados Detalhados</h3>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>({data.length} registros)</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              style={styles.exportBtn}
              onClick={handleExportAll}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(71, 85, 105, 0.8)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(51, 65, 85, 0.5)'; }}
            >
              <Download size={14} />
              Exportar Todos
            </button>
            <button 
              style={styles.exportBtn}
              onClick={handleExportAlerts}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(71, 85, 105, 0.8)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(51, 65, 85, 0.5)'; }}
            >
              <Download size={14} />
              Exportar Alertas
            </button>
          </div>
        </div>

        <div style={styles.tabs}>
          {[
            { id: 'all', label: 'Todos' },
            { id: 'negative', label: '❌ Negativos' },
            { id: 'high', label: '⚠️ Alto Consumo' },
            { id: 'zero', label: '— Zero' },
            { id: 'low', label: '↘ Baixo' },
            { id: 'ok', label: '✅ OK' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { onFilterChange({ status: tab.id as FilterConfig['status'] }); setCurrentPage(1); }}
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
              onChange={(e) => { onFilterChange({ apartment: e.target.value }); setCurrentPage(1); }}
              style={styles.searchInput}
            />
          </div>
          <select
            value={filter.tower}
            onChange={(e) => { onFilterChange({ tower: e.target.value }); setCurrentPage(1); }}
            style={styles.select}
          >
            <option value="">Todas as Torres</option>
            {towers.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Consumo mín (m³)"
            value={filter.consumptionMin}
            onChange={(e) => { onFilterChange({ consumptionMin: e.target.value }); setCurrentPage(1); }}
            style={{ ...styles.searchInput, minWidth: '140px', paddingLeft: '12px' }}
          />
          <input
            type="number"
            placeholder="Consumo máx (m³)"
            value={filter.consumptionMax}
            onChange={(e) => { onFilterChange({ consumptionMax: e.target.value }); setCurrentPage(1); }}
            style={{ ...styles.searchInput, minWidth: '140px', paddingLeft: '12px' }}
          />
        </div>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              {[
                { field: 'torre' as SortField, label: 'Torre' },
                { field: 'ap' as SortField, label: 'Ap' },
                { field: 'indiceAnterior' as SortField, label: 'Índice Anterior' },
                { field: 'indiceAtual' as SortField, label: 'Índice Atual' },
                { field: 'consumo' as SortField, label: 'Consumo (m³)' },
                { field: 'status' as SortField, label: 'Status' },
              ].map(({ field, label }) => (
                <th 
                  key={field} 
                  style={styles.th}
                  onClick={() => handleSort(field)}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {label}
                    <SortIcon field={field} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr
                key={`${item.torre}-${item.ap}-${(currentPage - 1) * pageSize + index}`}
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
                  <span style={styles.statusBadge(item.statusClass, item.status)}>
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

      {data.length > 0 && (
        <div style={styles.pagination}>
          <div style={styles.paginationInfo}>
            Mostrando {((currentPage - 1) * pageSize) + 1} a {Math.min(currentPage * pageSize, data.length)} de {data.length} registros
          </div>
          <div style={styles.paginationControls}>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              style={styles.pageSizeSelect}
            >
              {PAGINATION.PAGE_SIZE_OPTIONS.map(size => (
                <option key={size} value={size}>{size} / página</option>
              ))}
            </select>
            <button
              style={styles.navBtn}
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              style={styles.navBtn}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ color: '#fff', fontSize: '13px', padding: '0 8px' }}>
              {currentPage} / {totalPages}
            </span>
            <button
              style={styles.navBtn}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
            <button
              style={styles.navBtn}
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
