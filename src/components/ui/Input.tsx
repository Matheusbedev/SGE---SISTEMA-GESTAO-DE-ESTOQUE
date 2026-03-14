import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  optional?: boolean;
}

export function Input({ label, error, hint, leftIcon, rightIcon, optional, className = '', id, ...props }: InputProps) {
  const inputId = id ?? (label ? `input-${label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}` : undefined);
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700 leading-none">
            {label}
          </label>
          {optional && <span className="text-xs text-gray-400">Opcional</span>}
        </div>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            w-full rounded-xl border bg-white text-sm text-gray-900 placeholder-gray-400
            px-3 py-2.5 transition-all duration-150
            border-gray-200 hover:border-gray-300
            focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10
            disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
            ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10 bg-red-50/30' : ''}
            ${leftIcon ? 'pl-9' : ''}
            ${rightIcon ? 'pr-9' : ''}
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}
