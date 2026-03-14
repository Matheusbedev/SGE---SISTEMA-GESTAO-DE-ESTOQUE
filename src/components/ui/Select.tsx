import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  optional?: boolean;
}

export function Select({ label, error, hint, options, placeholder, optional, className = '', id, ...props }: SelectProps) {
  const selectId = id ?? (label ? `select-${label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}` : undefined);
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={selectId} className="text-sm font-medium text-gray-700 leading-none">
            {label}
          </label>
          {optional && <span className="text-xs text-gray-400">Opcional</span>}
        </div>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`
            w-full appearance-none rounded-xl border bg-white text-sm text-gray-900
            px-3 py-2.5 pr-9 transition-all duration-150
            border-gray-200 hover:border-gray-300
            focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10
            disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
            ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : ''}
            ${className}
          `}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}
