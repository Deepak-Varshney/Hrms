import React, { useState, useEffect } from 'react';
import { sonnerStore, Toast } from '../lib/sonner';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { InfoCircleIcon } from './icons/InfoCircleIcon';

const ICONS: Record<Toast['type'], React.ReactNode> = {
  success: <CheckCircleIcon className="w-5 h-5 text-green-500" />,
  error: <XCircleIcon className="w-5 h-5 text-red-500" />,
  info: <InfoCircleIcon className="w-5 h-5 text-blue-500" />,
};

const ToastMessage: React.FC<{ toast: Toast, onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
            // Wait for animation to finish before removing from DOM
            setTimeout(() => onDismiss(toast.id), 300);
        }, 4000);

        return () => clearTimeout(timer);
    }, [toast, onDismiss]);

    return (
        <div 
            className={`
                w-full max-w-sm bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden
                transition-all duration-300 ease-in-out
                ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            `}
        >
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {ICONS[toast.type]}
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {toast.message}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};


export const Toaster: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>(sonnerStore.getToasts());

  useEffect(() => {
    const unsubscribe = sonnerStore.subscribe(() => {
      setToasts(sonnerStore.getToasts());
    });
    // Fix: The useEffect cleanup function must return void or a function that returns void.
    // The `unsubscribe` function from `sonnerStore` returns a boolean, which violates the rule.
    // Wrapping it in a function ensures the return type is void.
    return () => {
      unsubscribe();
    };
  }, []);
  
  const handleDismiss = (id: string) => {
      sonnerStore.dismiss(id);
  }

  return (
    <div aria-live="assertive" className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-[100]">
        <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
            {toasts.map(toast => (
                <ToastMessage key={toast.id} toast={toast} onDismiss={handleDismiss}/>
            ))}
        </div>
    </div>
  );
};
