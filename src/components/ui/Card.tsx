import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  padding?: boolean;
  hover?: boolean;
}

export function Card({ children, className = '', title, subtitle, action, padding = true, hover = false }: CardProps) {
  return (
    <div className={`rounded-2xl bg-white ring-1 ring-gray-900/5 shadow-sm ${hover ? 'card-hover' : ''} ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      <div className={padding ? 'p-6' : ''}>{children}</div>
    </div>
  );
}
