import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  delay?: number;
}

const colorMap = {
  primary: {
    bg: 'from-primary-500/20 to-primary-600/20',
    icon: 'text-primary-400',
    glow: 'shadow-primary-500/20',
    border: 'border-primary-500/30',
  },
  secondary: {
    bg: 'from-secondary-500/20 to-secondary-600/20',
    icon: 'text-secondary-400',
    glow: 'shadow-secondary-500/20',
    border: 'border-secondary-500/30',
  },
  success: {
    bg: 'from-emerald-500/20 to-emerald-600/20',
    icon: 'text-emerald-400',
    glow: 'shadow-emerald-500/20',
    border: 'border-emerald-500/30',
  },
  warning: {
    bg: 'from-amber-500/20 to-amber-600/20',
    icon: 'text-amber-400',
    glow: 'shadow-amber-500/20',
    border: 'border-amber-500/30',
  },
  danger: {
    bg: 'from-red-500/20 to-red-600/20',
    icon: 'text-red-400',
    glow: 'shadow-red-500/20',
    border: 'border-red-500/30',
  },
};

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  color = 'primary',
  delay = 0 
}: StatCardProps) {
  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={clsx(
        'relative rounded-2xl p-6 glass border overflow-hidden cursor-pointer',
        colors.border
      )}
    >
      {/* Background gradient */}
      <div className={clsx('absolute inset-0 bg-gradient-to-br opacity-50', colors.bg)} />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className={clsx('p-3 rounded-xl bg-dark-800/50', colors.icon)}
          >
            <Icon className="w-6 h-6" />
          </motion.div>
          
          {trend && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.3 }}
              className={clsx(
                'text-sm font-medium px-2 py-1 rounded-lg',
                trend === 'up' && 'text-emerald-400 bg-emerald-500/20',
                trend === 'down' && 'text-red-400 bg-red-500/20',
                trend === 'neutral' && 'text-dark-400 bg-dark-700/50'
              )}
            >
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {trendValue}
            </motion.div>
          )}
        </div>
        
        <div>
          <p className="text-dark-400 text-sm font-medium mb-1">{title}</p>
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.2, type: 'spring' }}
            className="text-3xl font-bold text-white"
          >
            {value}
          </motion.p>
        </div>
      </div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)`,
        }}
      />
    </motion.div>
  );
}
