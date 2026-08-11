import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import type { Alert } from '../types';

interface AlertsListProps {
  alerts: Alert[];
}

export function AlertsList({ alerts }: AlertsListProps) {
  const styles = {
    card: {
      background: 'rgba(30, 41, 59, 0.7)',
      backdropFilter: 'blur(12px)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(148, 163, 184, 0.1)',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between' as const,
      marginBottom: '20px',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    icon: {
      width: '20px',
      height: '20px',
      color: '#fbbf24',
    },
    title: {
      fontSize: '16px',
      fontWeight: 600,
      color: '#fff',
      margin: 0,
    },
    badge: {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 500,
      background: 'rgba(245, 158, 11, 0.2)',
      color: '#fbbf24',
    },
    list: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px',
      maxHeight: '320px',
      overflowY: 'auto' as const,
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 0',
    },
    emptyIcon: {
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      background: 'rgba(16, 185, 129, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '16px',
      color: '#34d399',
    },
    emptyTitle: {
      fontWeight: 600,
      color: '#fff',
      marginBottom: '4px',
    },
    emptySubtitle: {
      fontSize: '14px',
      color: '#94a3b8',
    },
    alertItem: (type: 'negative' | 'high') => ({
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '16px',
      borderRadius: '12px',
      border: `1px solid ${type === 'negative' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
      background: type === 'negative' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
      cursor: 'pointer',
      transition: 'background 0.2s',
    }),
    alertIcon: (type: 'negative' | 'high') => ({
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      background: type === 'negative' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      color: type === 'negative' ? '#f87171' : '#fbbf24',
    }),
    alertContent: {
      flex: 1,
      minWidth: 0,
    },
    alertMessage: {
      fontWeight: 500,
      color: '#fff',
      marginBottom: '4px',
      fontSize: '14px',
    },
    alertLocation: {
      fontSize: '12px',
      color: '#94a3b8',
    },
    alertValue: (type: 'negative' | 'high') => ({
      fontWeight: 700,
      color: type === 'negative' ? '#f87171' : '#fbbf24',
      fontSize: '14px',
      flexShrink: 0,
    }),
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <AlertTriangle style={styles.icon} />
          <h3 style={styles.title}>Alertas Detectados</h3>
        </div>
        <span style={styles.badge}>{alerts.length} alertas</span>
      </div>

      <div style={styles.list}>
        {alerts.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <CheckCircle size={32} />
            </div>
            <p style={styles.emptyTitle}>Tudo certo!</p>
            <p style={styles.emptySubtitle}>Nenhum alerta detectado</p>
          </div>
        ) : (
          alerts.map((alert, index) => (
            <div
              key={`${alert.tower}-${alert.ap}-${index}`}
              style={styles.alertItem(alert.type)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = alert.type === 'negative' 
                  ? 'rgba(239, 68, 68, 0.2)' 
                  : 'rgba(245, 158, 11, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = alert.type === 'negative' 
                  ? 'rgba(239, 68, 68, 0.1)' 
                  : 'rgba(245, 158, 11, 0.1)';
              }}
            >
              <div style={styles.alertIcon(alert.type)}>
                {alert.type === 'negative' ? <XCircle size={20} /> : <AlertTriangle size={20} />}
              </div>
              <div style={styles.alertContent}>
                <p style={styles.alertMessage}>{alert.message}</p>
                <p style={styles.alertLocation}>Torre {alert.tower} • Ap {alert.ap}</p>
              </div>
              <div style={styles.alertValue(alert.type)}>
                {alert.value.toFixed(2)} m³
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
