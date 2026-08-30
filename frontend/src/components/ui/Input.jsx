import React from 'react';

export default function Input({ label, id, error, icon: Icon, className = '', ...rest }) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-muted">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
        )}
        <input
          id={id}
          className={`input-field ${Icon ? 'pl-11' : ''} ${error ? 'border-status-danger/60' : ''} ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...rest}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-status-danger">
          {error}
        </p>
      )}
    </div>
  );
}
