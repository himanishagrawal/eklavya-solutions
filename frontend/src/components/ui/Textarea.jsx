import React from 'react';

// PHASE 2: reusable textarea for optional longer-form onboarding
// fields (projects, certifications, internship experience).
export default function Textarea({ label, id, error, className = '', rows = 3, ...rest }) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-muted">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={`input-field resize-none ${error ? 'border-status-danger/60' : ''} ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-status-danger">
          {error}
        </p>
      )}
    </div>
  );
}
