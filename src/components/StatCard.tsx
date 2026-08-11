import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  delay?: number;
}

const colorMap = {
  primary: {
    bg: 'rgba(139, 92, 246, 0.15)',
    icon: '#a78bfa',
    border: 'rgba(139, 92, 246, 0.3)',
  },
  secondary: {
    bg: 'rgba(59, 130, 246, 0.15)',
    icon: '#60a5fa',
    border: 'rgba(59, 130, 246, 0.3)',
  },
  success: {
    bg: 'rgba(16, 185, 129, 0.15)',
    icon: '#34d399',
    border: 'rgba(16, 185, 129, 0.3)',
  },
  warning: {
    bg: 'rgba(245, 158, 11, 0.15)',
    icon: '#fbbf24',
    border: 'rgba(245, 158, 11, 0.3)',
  },
  danger: {
    bg: 'rgba(239, 68, 68, 0.15)',
    icon: '#f87171',
    border: 'rgba(239, 68, 68, 0.3)',
  },
};

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color = 'primary',
}: StatCardProps) {
  const colors = colorMap[color];

  const styles = {
    card: {
      position: 'relative' as const,
      borderRadius: '16px',
      padding: '24px',
      background: 'rgba(30, 41, 59, 0.7)',
      backdropFilter: 'blur(12px)',
      border: `1px solid ${colors.border}`,
      overflow: 'hidden' as const,
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    bgGradient: {
      position: 'absolute' as const,
      inset: 0,
      background: `linear-gradient(135deg, ${colors.bg}, transparent)`,
      opacity: 0.5,
    },
    content: {
      position: 'relative' as const,
      zIndex: 10,
    },
    iconWrapper: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      background: 'rgba(30, 41, 59, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '16px',
      color: colors.icon,
    },
    label: {
      fontSize: '14px',
      color: '#94a3b8',
      marginBottom: '4px',
    },
    value: {
      fontSize: '28px',
      fontWeight: 700,
      color: '#fff',
    },
  };

  return (
    <div 
      style={styles.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `0 10px 30px ${colors.bg}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={styles.bgGradient} />
      <div style={styles.content}>
        <div style={styles.iconWrapper}>
          <Icon size={24} />
        </div>
        <div style={styles.label}>{title}</div>
        <div style={styles.value}>{value}</div>
      </div>
    </div>
  );
}
