import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-3xl">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      {description && <p className="mt-1.5 text-sm text-gray-400 max-w-xs leading-relaxed">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
