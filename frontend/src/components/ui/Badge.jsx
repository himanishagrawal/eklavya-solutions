import React from 'react';

// PHASE 2: small pill used for skill proficiency tags, categories, etc.
const TONES = {
  accent: 'bg-accent-soft text-accent border-accent/20',
  indigo: 'bg-indigo/10 text-indigo border-indigo/20',
  success: 'bg-status-success/10 text-status-success border-status-success/20',
  warning: 'bg-status-warning/10 text-status-warning border-status-warning/20',
  neutral: 'bg-surface-elevated text-ink-muted border-surface-border',
};

export default function Badge({ children, tone = 'neutral', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
