'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface CustomToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function CustomToast({
  message,
  type,
  isVisible,
  onClose,
  duration = 5000,
}: CustomToastProps) {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 300); // Wait for animation
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!shouldRender) return null;

  const styles = {
    success: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-800',
      icon: <CheckCircle className='h-5 w-5 text-emerald-600' />,
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: <XCircle className='h-5 w-5 text-red-600' />,
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: <AlertCircle className='h-5 w-5 text-blue-600' />,
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      icon: <AlertCircle className='h-5 w-5 text-amber-600' />,
    },
  }[type];

  return (
    <div
      className={`fixed top-4 right-4 z-[9999] transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
      }`}
    >
      <div
        className={`${styles.bg} ${styles.border} ${styles.text} border px-4 py-3 rounded-2xl shadow-xl shadow-slate-200/50 flex items-center gap-3 min-w-[300px] max-w-md`}
      >
        {styles.icon}
        <p className='flex-1 text-sm font-bold'>{message}</p>
        <button
          onClick={onClose}
          className='p-1 hover:bg-black/5 rounded-full transition-colors'
        >
          <X className='h-4 w-4 opacity-50' />
        </button>
      </div>
    </div>
  );
}
