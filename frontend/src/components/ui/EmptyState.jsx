import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  message = 'This section will populate as data becomes available.',
  action,
  className = '',
}) {
  return (
    <div className={`surface-card flex flex-col items-center gap-3 p-10 text-center ${className}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft">
        <Icon size={22} className="text-accent" />
      </div>
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="max-w-sm text-sm text-ink-muted">{message}</p>
      {action}
    </div>
  );
}
