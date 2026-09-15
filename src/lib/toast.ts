export type ToastType = 'success' | 'error' | 'warning' | 'confirmation';

export interface ToastOptions {
  id?: string;
  type?: ToastType;
  title?: string;
  message: string;
  duration?: number; // ms, default 4500 (ignored for confirmation unless explicitly set)
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface ToastItem extends Required<Omit<ToastOptions, 'onConfirm' | 'onCancel'>> {
  onConfirm?: () => void;
  onCancel?: () => void;
  createdAt: number;
}

const TOAST_EVENT = 'sk-toast-event';

/** Dispatch toast event across entire website */
export function showToast(options: ToastOptions): string {
  if (typeof window === 'undefined') return '';
  const id = options.id || `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const event = new CustomEvent(TOAST_EVENT, {
    detail: { ...options, id },
  });
  window.dispatchEvent(event);
  return id;
}

export const toast = {
  success: (message: string, title: string = 'Success', duration: number = 4500) => {
    return showToast({ type: 'success', title, message, duration });
  },
  error: (message: string, title: string = 'Error', duration: number = 5500) => {
    return showToast({ type: 'error', title, message, duration });
  },
  warning: (message: string, title: string = 'Warning', duration: number = 5000) => {
    return showToast({ type: 'warning', title, message, duration });
  },
  confirmation: (options: {
    message: string;
    title?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
  }) => {
    return showToast({
      type: 'confirmation',
      title: options.title || 'Please Confirm',
      message: options.message,
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel',
      onConfirm: options.onConfirm,
      onCancel: options.onCancel,
      duration: 0, // Stay visible until user interacts
    });
  },
  dismiss: (id: string) => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent('sk-toast-dismiss', { detail: { id } }));
  },
};

export { TOAST_EVENT };
