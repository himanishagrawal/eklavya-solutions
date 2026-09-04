import React from 'react';
import { ChevronDown } from 'lucide-react';

// PHASE 2: reusable select, styled to match Input.jsx exactly so
// onboarding/profile forms stay visually consistent with the rest
// of the design system.
export default function Select({ label, id, error, options = [], placeholder, className = '', ...rest }) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-muted">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={`input-field appearance-none pr-10 ${error ? 'border-status-danger/60' : ''} ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-status-danger">
          {error}
        </p>
      )}
    </div>
  );
}
