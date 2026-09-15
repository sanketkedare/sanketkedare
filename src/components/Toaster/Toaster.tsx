'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCheckCircle,
  FiAlertCircle,
  FiAlertTriangle,
  FiHelpCircle,
  FiX,
  FiCheck,
} from 'react-icons/fi';
import { ToastItem, ToastOptions, TOAST_EVENT } from '@/lib/toast';

export default function Toaster() {
  const [mounted, setMounted] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleAddToast = (event: Event) => {
      const customEvent = event as CustomEvent<ToastOptions>;
      const detail = customEvent.detail;
      if (!detail || !detail.message) return;

      const newToast: ToastItem = {
        id: detail.id || `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        type: detail.type || 'success',
        title: detail.title || (detail.type === 'confirmation' ? 'Confirmation' : detail.type ? detail.type.toUpperCase() : 'Notice'),
        message: detail.message,
        duration: detail.duration ?? (detail.type === 'confirmation' ? 0 : 4500),
        confirmText: detail.confirmText || 'Confirm',
        cancelText: detail.cancelText || 'Cancel',
        onConfirm: detail.onConfirm,
        onCancel: detail.onCancel,
        createdAt: Date.now(),
      };

      setToasts((prev) => {
        // Keep at most 5 concurrent toasts to avoid viewport overflow
        const filtered = prev.filter((t) => t.id !== newToast.id);
        if (filtered.length >= 5) {
          filtered.shift();
        }
        return [...filtered, newToast];
      });
    };

    const handleDismissToast = (event: Event) => {
      const customEvent = event as CustomEvent<{ id: string }>;
      if (customEvent.detail?.id) {
        removeToast(customEvent.detail.id);
      }
    };

    window.addEventListener(TOAST_EVENT, handleAddToast);
    window.addEventListener('sk-toast-dismiss', handleDismissToast);

    return () => {
      window.removeEventListener(TOAST_EVENT, handleAddToast);
      window.removeEventListener('sk-toast-dismiss', handleDismissToast);
    };
  }, [mounted, removeToast]);

  if (!mounted) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-[999999] flex flex-col gap-3 pointer-events-none max-w-sm sm:max-w-md w-full px-4 sm:px-0"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Auto-dismiss countdown
  useEffect(() => {
    if (toast.duration <= 0 || isHovered) return;

    const timer = setTimeout(() => {
      onDismiss();
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.duration, isHovered, onDismiss]);

  const handleConfirm = () => {
    try {
      toast.onConfirm?.();
    } finally {
      onDismiss();
    }
  };

  const handleCancel = () => {
    try {
      toast.onCancel?.();
    } finally {
      onDismiss();
    }
  };

  // Color & Icon schema
  const config = {
    success: {
      border: 'border-emerald-500/30 dark:border-emerald-500/40',
      bgGlow: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
      progressBar: 'bg-emerald-500',
      icon: <FiCheckCircle size={20} className="shrink-0 text-emerald-400" />,
      badge: 'text-emerald-400 bg-emerald-500/15',
    },
    error: {
      border: 'border-rose-500/30 dark:border-rose-500/40',
      bgGlow: 'bg-rose-500/10',
      iconColor: 'text-rose-400',
      progressBar: 'bg-rose-500',
      icon: <FiAlertCircle size={20} className="shrink-0 text-rose-400" />,
      badge: 'text-rose-400 bg-rose-500/15',
    },
    warning: {
      border: 'border-amber-500/30 dark:border-amber-500/40',
      bgGlow: 'bg-amber-500/10',
      iconColor: 'text-amber-400',
      progressBar: 'bg-amber-500',
      icon: <FiAlertTriangle size={20} className="shrink-0 text-amber-400" />,
      badge: 'text-amber-400 bg-amber-500/15',
    },
    confirmation: {
      border: 'border-cyan-500/40 dark:border-cyan-500/50',
      bgGlow: 'bg-cyan-500/10',
      iconColor: 'text-cyan-400',
      progressBar: 'bg-cyan-500',
      icon: <FiHelpCircle size={20} className="shrink-0 text-cyan-400" />,
      badge: 'text-cyan-400 bg-cyan-500/15',
    },
  }[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.9, x: 20 }}
      animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: 30, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`pointer-events-auto relative overflow-hidden rounded-2xl border backdrop-blur-2xl shadow-2xl ${config.border} bg-[#0a0f24]/95 dark:bg-[#070b1a]/95 text-white`}
    >
      {/* Top subtle glow */}
      <div className={`absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl pointer-events-none ${config.bgGlow}`} />

      <div className="p-4 flex items-start gap-3.5 relative z-10">
        {/* Type Icon */}
        <div className="mt-0.5">{config.icon}</div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-xs font-bold text-white tracking-wide uppercase">
              {toast.title}
            </h4>
            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${config.badge}`}>
              {toast.type}
            </span>
          </div>

          <p className="text-xs leading-relaxed text-slate-300 break-words font-medium">
            {toast.message}
          </p>

          {/* Action buttons for confirmation type */}
          {toast.type === 'confirmation' && (
            <div className="flex items-center gap-2 mt-3.5 pt-2 border-t border-white/10">
              <button
                onClick={handleConfirm}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md hover:shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <FiCheck size={13} />
                <span>{toast.confirmText}</span>
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
              >
                {toast.cancelText}
              </button>
            </div>
          )}
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onDismiss}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0 mt-0.5"
          title="Dismiss"
        >
          <FiX size={15} />
        </button>
      </div>

      {/* Animated auto-dismiss countdown bar */}
      {toast.duration > 0 && !isHovered && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: toast.duration / 1000, ease: 'linear' }}
          className={`h-0.5 w-full ${config.progressBar}`}
        />
      )}
    </motion.div>
  );
}
