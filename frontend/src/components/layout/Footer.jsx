import React from 'react';
import Logo from '../ui/Logo.jsx';

export default function Footer() {
  return (
    <footer className="border-t border-surface-border/70 bg-base-soft">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <Logo size={26} />
          <p className="mt-3 max-w-sm text-sm text-ink-muted">
            Bridging Skills with Industry — an evidence-based platform connecting
            industry demand, training curricula and student skill development.
          </p>
        </div>
        <p className="text-xs text-ink-faint">
          © {new Date().getFullYear()} Eklavya Solutions. Built for skill-development innovation.
        </p>
      </div>
    </footer>
  );
}
