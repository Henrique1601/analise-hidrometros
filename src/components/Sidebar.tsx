import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 h-screen glass border-r border-dark-700/50 z-50 flex flex-col"
    >
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-dark-700/50">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0"
        >
          <Droplets className="w-6 h-6 text-white" />
        </motion.div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="font-bold text-lg gradient-text">Hidrômetros</h1>
              <p className="text-xs text-dark-400">Análise Inteligente</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveItem(item.id)}
              className={clsx(
                'w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200',
                isActive 
                  ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-white glow-primary' 
                  : 'text-dark-400 hover:text-white hover:bg-dark-700/50'
              )}
            >
              <item.icon className={clsx('w-5 h-5 flex-shrink-0', isActive && 'text-primary-400')} />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </nav>

      {/* Toggle Button */}
      <div className="p-4 border-t border-dark-700/50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-dark-700/50 text-dark-400 hover:text-white hover:bg-dark-600/50 transition-all"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm"
              >
                Recolher
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  );
}
