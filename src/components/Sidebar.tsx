import { useState } from 'react';
import { 
  LayoutDashboard, 
  Upload, 
  BarChart3, 
  AlertTriangle, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Droplets,
  FileSpreadsheet
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Upload, label: 'Carregar Planilha', id: 'upload' },
  { icon: BarChart3, label: 'Análise', id: 'analysis' },
  { icon: AlertTriangle, label: 'Alertas', id: 'alerts' },
  { icon: FileSpreadsheet, label: 'Relatórios', id: 'reports' },
  { icon: Settings, label: 'Configurações', id: 'settings' },
];

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const [activeItem, setActiveItem] = useState('dashboard');

  const styles = {
    sidebar: {
      position: 'fixed' as const,
      left: 0,
      top: 0,
      height: '100vh',
      width: isCollapsed ? '80px' : '280px',
      background: 'rgba(30, 41, 59, 0.95)',
      backdropFilter: 'blur(12px)',
      borderRight: '1px solid rgba(148, 163, 184, 0.1)',
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column' as const,
      transition: 'width 0.3s ease',
      overflow: 'hidden',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '20px 16px',
      borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
    },
    logoIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    logoText: {
      overflow: 'hidden',
    },
    logoTitle: {
      fontWeight: 700,
      fontSize: '18px',
      background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      whiteSpace: 'nowrap' as const,
    },
    logoSubtitle: {
      fontSize: '12px',
      color: '#94a3b8',
      whiteSpace: 'nowrap' as const,
    },
    nav: {
      flex: 1,
      padding: '24px 12px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
    },
    menuItem: (isActive: boolean) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      width: '100%',
      padding: isCollapsed ? '12px' : '12px 16px',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      justifyContent: isCollapsed ? 'center' : 'flex-start',
      background: isActive 
        ? 'linear-gradient(90deg, rgba(139,92,246,0.2), rgba(59,130,246,0.2))' 
        : 'transparent',
      color: isActive ? '#fff' : '#94a3b8',
    }),
    menuIcon: (isActive: boolean) => ({
      width: '20px',
      height: '20px',
      flexShrink: 0,
      color: isActive ? '#a78bfa' : 'inherit',
    }),
    menuLabel: {
      fontWeight: 500,
      whiteSpace: 'nowrap' as const,
    },
    footer: {
      padding: '16px',
      borderTop: '1px solid rgba(148, 163, 184, 0.1)',
    },
    toggleBtn: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '12px',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      background: 'rgba(51, 65, 85, 0.5)',
      color: '#94a3b8',
      transition: 'all 0.2s',
    },
  };

  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logo}>
        <div style={styles.logoIcon}>
          <Droplets className="w-6 h-6 text-white" />
        </div>
        {!isCollapsed && (
          <div style={styles.logoText}>
            <div style={styles.logoTitle}>Hidrômetros</div>
            <div style={styles.logoSubtitle}>Análise Inteligente</div>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <nav style={styles.nav}>
        {menuItems.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              style={styles.menuItem(isActive)}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(51, 65, 85, 0.5)';
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                }
              }}
            >
              <item.icon style={styles.menuIcon(isActive)} />
              {!isCollapsed && (
                <span style={styles.menuLabel}>{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Toggle Button */}
      <div style={styles.footer}>
        <button
          onClick={onToggle}
          style={styles.toggleBtn}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(71, 85, 105, 0.5)';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(51, 65, 85, 0.5)';
            e.currentTarget.style.color = '#94a3b8';
          }}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!isCollapsed && <span style={{ fontSize: '14px' }}>Recolher</span>}
        </button>
      </div>
    </aside>
  );
}
