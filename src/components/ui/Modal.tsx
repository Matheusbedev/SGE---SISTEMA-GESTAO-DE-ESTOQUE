import React, { useEffect } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

export function Modal({ open, onClose, title, subtitle, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) {
      document.addEventListener('keydown', handler);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} animate-scale-in`}>
        <div className="rounded-2xl bg-white shadow-2xl ring-1 ring-gray-900/5 overflow-hidden">
          {title && (
            <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-base font-semibold text-gray-900 leading-tight">{title}</h2>
                {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="ml-4 flex-shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
