import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success' | 'warning' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 cursor-pointer select-none disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 active:scale-[0.98]';

const variants: Record<string, string> = {
  primary:   'bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-[0_1px_2px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.15)] hover:from-blue-600 hover:to-blue-700 disabled:from-blue-300 disabled:to-blue-300 disabled:shadow-none',
  secondary: 'bg-white text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50',
  danger:    'bg-gradient-to-b from-red-500 to-red-600 text-white shadow-[0_1px_2px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.15)] hover:from-red-600 hover:to-red-700 disabled:from-red-300 disabled:to-red-300',
  ghost:     'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-40',
  success:   'bg-gradient-to-b from-emerald-500 to-emerald-600 text-white shadow-[0_1px_2px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.15)] hover:from-emerald-600 hover:to-emerald-700 disabled:from-emerald-300 disabled:to-emerald-300',
  warning:   'bg-gradient-to-b from-amber-400 to-amber-500 text-white shadow-[0_1px_2px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.15)] hover:from-amber-500 hover:to-amber-600 disabled:from-amber-300 disabled:to-amber-300',
  outline:   'bg-transparent text-blue-600 border border-blue-200 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-40',
};

const sizes: Record<string, string> = {
  xs: 'h-7  px-2.5 text-xs  gap-1.5',
  sm: 'h-8  px-3   text-sm  gap-1.5',
  md: 'h-9  px-4   text-sm  gap-2',
  lg: 'h-11 px-5   text-base gap-2',
};

export function Button({
  variant = 'primary', size = 'md', loading = false,
  icon, iconRight, fullWidth = false,
  className = '', children, disabled, ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? <span className="flex-shrink-0 leading-none">{icon}</span> : null}
      {children && <span>{children}</span>}
      {iconRight && !loading && <span className="flex-shrink-0 leading-none ml-auto">{iconRight}</span>}
    </button>
  );
}
