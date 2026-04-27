import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: 'primary' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/50"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${confirmVariant === 'danger' ? 'bg-red-100' : 'bg-blue-100'}`}>
                <Icon 
                  icon={confirmVariant === 'danger' ? 'lucide:alert-triangle' : 'lucide:help-circle'} 
                  className={`w-5 h-5 ${confirmVariant === 'danger' ? 'text-red-600' : 'text-blue-600'}`} 
                />
              </div>
              <h2 className="text-lg font-bold">{title}</h2>
            </div>
            <p className="text-[#525252] mb-6">{message}</p>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 py-3 border border-[#DEE0E3] rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 py-3 text-white rounded-xl font-medium transition-colors ${
                  confirmVariant === 'danger' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-[#0677F9] hover:bg-blue-600'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}