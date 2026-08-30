import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, LogOut, ChevronDown } from 'lucide-react';
import Sidebar from './Sidebar.jsx';
import { useAuth } from '../../hooks/useAuth.js';

export default function StudentLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-base">
      <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-surface-border/70 bg-base/90 px-4 backdrop-blur-md lg:px-8">
          <button
            className="rounded-lg p-2 text-ink-muted hover:bg-surface lg:hidden"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>

          <div className="hidden text-sm text-ink-muted lg:block">
            Bridging Skills with Industry
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 rounded-xl border border-surface-border bg-surface px-3 py-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
                {(user?.student?.fullName || user?.email || '?').charAt(0).toUpperCase()}
              </div>
              <span className="hidden text-sm font-medium text-ink sm:block">
                {user?.student?.fullName || 'Student'}
              </span>
              <ChevronDown size={14} className="hidden text-ink-faint sm:block" />
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-xl border border-surface-border px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:border-status-danger/50 hover:text-status-danger"
              aria-label="Log out"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
