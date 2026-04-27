import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose: (id: string) => void;
}

const icons = {
  success: 'lucide:check-circle',
  error: 'lucide:x-circle',
  warning: 'lucide:alert-triangle',
  info: 'lucide:info',
};

const titleLabels = {
  success: 'Sucesso',
  error: 'Erro',
  warning: 'Aviso',
  info: 'Info',
};

export function Toast({ id, type, message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 4000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const styles = {
    success: {
      bg: 'bg-green-50 border-green-500',
      icon: 'text-green-600',
      title: 'text-green-800',
      message: 'text-green-700',
      border: 'border-l-4 border-green-500',
    },
    error: {
      bg: 'bg-red-50 border-red-500',
      icon: 'text-red-600',
      title: 'text-red-800',
      message: 'text-red-700',
      border: 'border-l-4 border-red-500',
    },
    warning: {
      bg: 'bg-amber-50 border-amber-500',
      icon: 'text-amber-600',
      title: 'text-amber-800',
      message: 'text-amber-700',
      border: 'border-l-4 border-amber-500',
    },
    info: {
      bg: 'bg-blue-50 border-blue-500',
      icon: 'text-blue-600',
      title: 'text-blue-800',
      message: 'text-blue-700',
      border: 'border-l-4 border-blue-500',
    },
  };

  const s = styles[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, y: 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 100, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`p-4 rounded-xl shadow-lg flex items-start gap-3 min-w-[320px] max-w-md ${s.bg} ${s.border}`}
    >
      <Icon icon={icons[type]} className={`w-5 h-5 mt-0.5 shrink-0 ${s.icon}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold ${s.title}`}>{titleLabels[type]}</p>
        <p className={`text-xs mt-0.5 ${s.message}`}>{message}</p>
      </div>
      <button onClick={() => onClose(id)} className={`text-xs hover:underline shrink-0 ${s.icon}`}>
        Fechar
      </button>
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: Array<{ id: string; type: 'success' | 'error' | 'warning' | 'info'; message: string }>;
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={onClose}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}