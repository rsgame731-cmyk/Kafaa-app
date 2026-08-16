import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-sm w-11/12 animate-view-transition">
      <div className={`flex items-center gap-3 p-3.5 rounded-card shadow-elevated border backdrop-blur-md ${
        isSuccess
          ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
          : isError
          ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
          : 'bg-brand-elevated/90 border-brand-bronze/40 text-brand-cream'
      }`}>
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
        {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 text-brand-bronze shrink-0" />}
        <p className="text-xs font-medium flex-1">{toast.message}</p>
        <button
          onClick={onClose}
          className="p-1 text-brand-muted hover:text-brand-cream rounded-full transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
