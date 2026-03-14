import React, { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  toast: (title: string, type?: ToastType, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

const config: Record<ToastType, { icon: React.ReactNode; bar: string; bg: string; title: string }> = {
  success: {
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>,
    bar: 'bg-emerald-500', bg: 'bg-emerald-50 border-emerald-200', title: 'text-emerald-800',
  },
  error: {
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>,
    bar: 'bg-red-500', bg: 'bg-red-50 border-red-200', title: 'text-red-800',
  },
  warning: {
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>,
    bar: 'bg-amber-500', bg: 'bg-amber-50 border-amber-200', title: 'text-amber-800',
  },
  info: {
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    bar: 'bg-blue-500', bg: 'bg-blue-50 border-blue-200', title: 'text-blue-800',
  },
};

const iconBg: Record<ToastType, string> = {
  success: 'bg-emerald-100 text-emerald-600',
  error:   'bg-red-100 text-red-600',
  warning: 'bg-amber-100 text-amber-600',
  info:    'bg-blue-100 text-blue-600',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((title: string, type: ToastType = 'success', message?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev.slice(-4), { id, type, title, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 pointer-events-none w-80">
        {toasts.map((t) => {
          const c = config[t.type];
          return (
            <div
              key={t.id}
              className={`pointer-events-auto rounded-xl border shadow-lg overflow-hidden animate-slide-right ${c.bg}`}
            >
              <div className={`h-0.5 ${c.bar}`} />
              <div className="flex items-start gap-3 px-4 py-3">
                <div className={`flex-shrink-0 rounded-lg p-1.5 mt-0.5 ${iconBg[t.type]}`}>
                  {c.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${c.title}`}>{t.title}</p>
                  {t.message && <p className="text-xs text-gray-500 mt-0.5">{t.message}</p>}
                </div>
                <button
                  onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
