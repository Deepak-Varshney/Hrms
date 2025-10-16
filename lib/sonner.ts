export type ToastType = 'success' | 'error' | 'info';
export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toasts: Toast[] = [];
const listeners: Set<() => void> = new Set();

const broadcast = () => {
    listeners.forEach(l => l());
}

const internalToast = (message: string, type: ToastType) => {
  const newToast: Toast = { id: Date.now().toString() + Math.random(), message, type };
  toasts = [newToast, ...toasts];
  broadcast();
};

export const toast = (message: string) => internalToast(message, 'info');
toast.success = (message: string) => internalToast(message, 'success');
toast.error = (message: string) => internalToast(message, 'error');

export const sonnerStore = {
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getToasts: () => toasts,
  dismiss: (id: string) => {
      toasts = toasts.filter(t => t.id !== id);
      broadcast();
  }
};
