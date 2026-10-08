import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'info' | 'warning';
  onClose: () => void;
}

export const QuickToast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3800);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-sm z-50 bg-[#131b2e] text-white p-3.5 rounded-xl shadow-xl flex items-center justify-between gap-3 border border-[#3d4947] animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center gap-2.5 min-w-0">
        {type === 'success' && <CheckCircle className="w-4 h-4 text-[#89f5e7] shrink-0" />}
        {type === 'info' && <Info className="w-4 h-4 text-[#93ccff] shrink-0" />}
        {type === 'warning' && <AlertCircle className="w-4 h-4 text-[#ffdad6] shrink-0" />}
        <span className="text-xs font-medium text-white truncate">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="text-[#bcc9c6] hover:text-white p-1 rounded-md transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
