import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: 'danger' | 'warning';
  loading?: boolean;
}

export function ConfirmDialog({
  open, onClose, onConfirm, title, message,
  confirmLabel = 'Confirmar', variant = 'danger', loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="text-center space-y-4">
        <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${variant === 'danger' ? 'bg-red-100' : 'bg-amber-100'}`}>
          <svg className={`w-7 h-7 ${variant === 'danger' ? 'text-red-600' : 'text-amber-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-2.5 justify-center pt-1">
          <Button variant="secondary" onClick={onClose} disabled={loading} size="sm">Cancelar</Button>
          <Button variant={variant === 'danger' ? 'danger' : 'warning'} onClick={onConfirm} loading={loading} size="sm">
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
