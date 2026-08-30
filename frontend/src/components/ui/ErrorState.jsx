import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button.jsx';

export default function ErrorState({
  title = 'Something went wrong',
  message = 'We could not complete that request. Please try again.',
  onRetry,
  className = '',
}) {
  return (
    <div className={`surface-card flex flex-col items-center gap-3 p-10 text-center ${className}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-status-danger/10">
        <AlertTriangle size={22} className="text-status-danger" />
      </div>
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="max-w-sm text-sm text-ink-muted">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="mt-2">
          Try again
        </Button>
      )}
    </div>
  );
}
