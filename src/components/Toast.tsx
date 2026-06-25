import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, Info, X, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type ToastType = 'success' | 'warning' | 'error' | 'info' | 'system';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
  warning: <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />,
  error: <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />,
  info: <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />,
  system: <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0 animate-pulse relative z-10" />,
};

const bgMap: Record<ToastType, string> = {
  success: 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.1)]',
  warning: 'bg-amber-500/10 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.1)]',
  error: 'bg-red-500/10 border-red-500/30 shadow-[0_0_12px_rgba(239,68,68,0.1)]',
  info: 'bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.1)]',
  system: 'bg-slate-950/80 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.25)] relative overflow-hidden',
};

const textMap: Record<ToastType, string> = {
  success: 'text-emerald-400',
  warning: 'text-amber-400',
  error: 'text-red-400',
  info: 'text-cyan-400',
  system: 'text-cyan-400 font-mono tracking-wide text-[10px] leading-relaxed relative z-10',
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-[9990] flex flex-col gap-2 pointer-events-none max-w-xs sm:max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);
  const duration = toast.duration || 3000;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [toast.id, duration, onRemove]);

  const progressColorMap: Record<ToastType, string> = {
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    error: 'bg-red-400',
    info: 'bg-cyan-400',
    system: 'bg-cyan-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 60, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`pointer-events-auto flex flex-col rounded-lg border backdrop-blur-md shadow-lg overflow-hidden ${bgMap[toast.type]}`}
    >
      <div className="flex items-start gap-2 p-2.5">
        {toast.type === 'system' && (
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-transparent pointer-events-none rounded-lg overflow-hidden">
            <div className="absolute inset-0 shimmer opacity-25" />
          </div>
        )}
        {iconMap[toast.type]}
        <span className={`flex-1 ${textMap[toast.type]} ${toast.type !== 'system' ? 'text-[11px] font-sans' : ''}`}>
          {toast.message}
        </span>
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => onRemove(toast.id), 300);
          }}
          className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer shrink-0 relative z-10"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
      {/* Progress bar */}
      <div className="w-full h-[2px] bg-transparent">
        <div
          className={`h-full ${progressColorMap[toast.type]} opacity-60`}
          style={{
            animation: `toast-progress ${duration}ms linear forwards`,
          }}
        />
      </div>
    </motion.div>
  );
};

