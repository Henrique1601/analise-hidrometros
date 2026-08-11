import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import type { Alert } from '../types';
import clsx from 'clsx';

interface AlertsListProps {
  alerts: Alert[];
}

export function AlertsList({ alerts }: AlertsListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6 border border-dark-700/50"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          Alertas Detectados
        </h3>
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="px-3 py-1 rounded-full text-sm font-medium bg-amber-500/20 text-amber-400"
        >
          {alerts.length} alertas
        </motion.span>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
        <AnimatePresence>
          {alerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4"
              >
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </motion.div>
              <p className="text-white font-semibold mb-1">Tudo certo!</p>
              <p className="text-dark-400 text-sm">Nenhum alerta detectado</p>
            </motion.div>
          ) : (
            alerts.map((alert, index) => (
              <motion.div
                key={`${alert.tower}-${alert.ap}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 5 }}
                className={clsx(
                  'flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer',
                  alert.type === 'negative'
                    ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                    : 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20'
                )}
              >
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  className={clsx(
                    'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                    alert.type === 'negative'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-amber-500/20 text-amber-400'
                  )}
                >
                  {alert.type === 'negative' ? (
                    <XCircle className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                </motion.div>

                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{alert.message}</p>
                  <p className="text-dark-400 text-sm">
                    Torre {alert.tower} • Ap {alert.ap}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className={clsx(
                    'font-bold',
                    alert.type === 'negative' ? 'text-red-400' : 'text-amber-400'
                  )}>
                    {alert.value.toFixed(2)} m³
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
