import type { Alert } from '../types';

interface AlertsListProps {
  alerts: Alert[];
}

export function AlertsList({ alerts }: AlertsListProps) {
  return (
    <div className="alerts-section">
      <h3>🚨 Alertas Detectados</h3>
      <div className="alerts-list">
        {alerts.length === 0 ? (
          <div className="alert-item ok">
            <span className="alert-icon">✅</span>
            Nenhum alerta detectado!
          </div>
        ) : (
          alerts.map((alert, index) => (
            <div 
              key={`${alert.tower}-${alert.ap}-${index}`} 
              className={`alert-item ${alert.type}`}
            >
              <span className="alert-icon">
                {alert.type === 'negative' ? '❌' : '⚠️'}
              </span>
              {alert.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
