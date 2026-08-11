import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const variantMap = {
  primary: 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/25',
  secondary: 'bg-dark-700/50 text-white border border-dark-600 hover:bg-dark-600/50',
  ghost: 'text-dark-400 hover:text-white hover:bg-dark-700/50',
  danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25',
};

const sizeMap = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  disabled = false,
  loading = false,
  className,
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        'relative flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 overflow-hidden',
        variantMap[variant],
        sizeMap[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {/* Loading spinner */}
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
        />
      )}
      
      {/* Icon */}
      {Icon && !loading && (
        <motion.div
          whileHover={{ rotate: 10 }}
          transition={{ duration: 0.2 }}
        >
          <Icon className="w-5 h-5" />
        </motion.div>
      )}
      
      {/* Text */}
      <span>{children}</span>
      
      {/* Hover shine effect */}
      <motion.div
        className="absolute inset-0 opacity-0"
        whileHover={{ opacity: 0.2 }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
        }}
      />
    </motion.button>
  );
}
