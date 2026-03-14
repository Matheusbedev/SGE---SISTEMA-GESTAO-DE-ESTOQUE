import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'indigo';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

const variants: Record<string, string> = {
  default: 'bg-gray-100 text-gray-600 ring-gray-200',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200',
  danger:  'bg-red-50 text-red-700 ring-red-200',
  info:    'bg-blue-50 text-blue-700 ring-blue-200',
  purple:  'bg-purple-50 text-purple-700 ring-purple-200',
  indigo:  'bg-indigo-50 text-indigo-700 ring-indigo-200',
};

const dots: Record<string, string> = {
  default: 'bg-gray-400',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger:  'bg-red-500',
  info:    'bg-blue-500',
  purple:  'bg-purple-500',
  indigo:  'bg-indigo-500',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

export function Badge({ children, variant = 'default', size = 'md', dot = false, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ${variants[variant]} ${sizes[size]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dots[variant]}`} />}
      {children}
    </span>
  );
}
