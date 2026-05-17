'use client';

import { AlertTriangle, X } from 'lucide-react';
import { useEffect } from 'react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  variant?: 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const colors = variant === 'danger'
    ? { icon: 'bg-red-50 text-red-500', btn: 'bg-red-500 hover:bg-red-600' }
    : { icon: 'bg-orange-50 text-orange-500', btn: 'bg-orange-500 hover:bg-orange-600' };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        {/* Close button */}
        <button onClick={onCancel} className="absolute top-4 end-4 p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={18} />
        </button>

        <div className="p-8 text-center">
          {/* Icon */}
          <div className={`w-16 h-16 rounded-2xl ${colors.icon} flex items-center justify-center mx-auto mb-5`}>
            <AlertTriangle size={28} />
          </div>

          {/* Text */}
          <h3 className="text-xl font-black text-[#2c2825] mb-2">{title}</h3>
          <p className="text-[#8a7f76] text-sm leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl font-bold text-sm bg-[#f5f1eb] text-[#8a7f76] hover:bg-[#e8dfd1] transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl font-bold text-sm text-white ${colors.btn} transition-colors`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
