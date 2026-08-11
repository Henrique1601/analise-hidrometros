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
import clsx from 'clsx';

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

  return (
    <aside
      className={clsx(
        "fixed left-0 top-0 h-screen glass border-r border-dark-700/50 z-50 flex flex-col transition-all duration-300",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-dark-700/50">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
          <Droplets className="w-6 h-6 text-white" />
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden">
            <h1 className="font-bold text-lg gradient-text whitespace-nowrap">Hidrômetros</h1>
            <p className="text-xs text-dark-400 whitespace-nowrap">Análise Inteligente</p>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-6 px-3 space-y-2">
        {menuItems.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={clsx(
                "flex items-center gap-3 w-full rounded-xl transition-all duration-200",
                isCollapsed ? "justify-center px-3 py-3" : "px-4 py-3",
                isActive 
                  ? "bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-white" 
                  : "text-dark-400 hover:text-white hover:bg-dark-700/50"
              )}
            >
              <item.icon className={clsx("w-5 h-5 flex-shrink-0", isActive && "text-primary-400")} />
              {!isCollapsed && (
                <span className="font-medium whitespace-nowrap">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Toggle Button */}
      <div className="px-3 pb-4">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-dark-700/50 text-dark-400 hover:text-white hover:bg-dark-600/50 transition-all"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          {!isCollapsed && (
            <span className="text-sm whitespace-nowrap">Recolher</span>
          )}
        </button>
      </div>
    </aside>
  );
}
