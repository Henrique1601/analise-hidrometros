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

  return (
    <div className="table-section">
      <h3>📋 Dados Detalhados</h3>
      
      <div className="tabs">
        <button 
          className={`tab ${filter.status === 'all' ? 'active' : ''}`}
          onClick={() => onFilterChange({ status: 'all' })}
        >
          Todos
        </button>
        <button 
          className={`tab ${filter.status === 'negative' ? 'active' : ''}`}
          onClick={() => onFilterChange({ status: 'negative' })}
        >
          ❌ Negativos
        </button>
        <button 
          className={`tab ${filter.status === 'high' ? 'active' : ''}`}
          onClick={() => onFilterChange({ status: 'high' })}
        >
          ⚠️ Alto Consumo
        </button>
        <button 
          className={`tab ${filter.status === 'ok' ? 'active' : ''}`}
          onClick={() => onFilterChange({ status: 'ok' })}
        >
          ✅ OK
        </button>
      </div>

      <div className="filter-row">
        <select 
          value={filter.tower} 
          onChange={(e) => onFilterChange({ tower: e.target.value })}
        >
          <option value="">Todas as Torres</option>
          {towers.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input 
          type="text" 
          placeholder="Filtrar por apartamento..."
          value={filter.apartment}
          onChange={(e) => onFilterChange({ apartment: e.target.value })}
        />
        <button className="export-btn" onClick={handleExportAlerts}>
          📥 Exportar Alertas
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Torre</th>
              <th>Ap</th>
              <th>Índice Anterior</th>
              <th>Índice Atual</th>
              <th>Consumo (m³)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr 
                key={`${item.torre}-${item.ap}-${index}`}
                className={`row-${item.statusClass}`}
              >
                <td>{item.torre}</td>
                <td>{item.ap}</td>
                <td>{item.indiceAnterior.toFixed(2)}</td>
                <td>{item.indiceAtual.toFixed(2)}</td>
                <td>{item.consumo.toFixed(2)}</td>
                <td>
                  <span className={`badge badge-${item.statusClass}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
