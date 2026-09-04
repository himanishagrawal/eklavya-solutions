import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Target,
  TrendingUp,
  BookOpen,
  Route as RouteIcon,
  Briefcase,
  UserCircle,
  Settings,
  X,
} from 'lucide-react';
import Logo from '../ui/Logo.jsx';

// Full future nav map per the master spec. Items without a `to`
// are not implemented yet and are intentionally rendered as
// disabled "coming in a future phase" entries - never fake links.
const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/app/dashboard' },
  { label: 'My Skills', icon: Target, to: '/app/skills' }, // PHASE 2
  { label: 'Skill Gap', icon: TrendingUp },
  { label: 'Learning', icon: BookOpen },
  { label: 'Career Pathway', icon: RouteIcon },
  { label: 'Jobs', icon: Briefcase },
  { label: 'Profile', icon: UserCircle, to: '/app/profile' }, // PHASE 2
  { label: 'Settings', icon: Settings },
];

function NavItem({ item, onNavigate }) {
  const Icon = item.icon;

  if (!item.to) {
    return (
      <div
        className="flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-ink-faint cursor-not-allowed select-none"
        title="Available in a future phase"
      >
        <span className="flex items-center gap-3 text-sm font-medium">
          <Icon size={18} />
          {item.label}
        </span>
        <span className="rounded-full border border-surface-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-ink-faint">
          Soon
        </span>
      </div>
    );
  }

  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-150 ${
          isActive
            ? 'bg-accent-soft text-accent'
            : 'text-ink-muted hover:bg-surface hover:text-ink'
        }`
      }
    >
      <Icon size={18} />
      {item.label}
    </NavLink>
  );
}

export function SidebarContent({ onNavigate }) {
  return (
    <div className="flex h-full flex-col gap-1 p-4">
      <div className="mb-6 px-2 py-2">
        <Logo size={28} />
      </div>
      {NAV_ITEMS.map((item) => (
        <NavItem key={item.label} item={item} onNavigate={onNavigate} />
      ))}
    </div>
  );
}

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-surface-border/70 bg-base-soft lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
          <div className="absolute left-0 top-0 h-full w-72 border-r border-surface-border bg-base shadow-2xl animate-fadeUp">
            <div className="flex items-center justify-end p-3">
              <button
                onClick={onClose}
                aria-label="Close navigation"
                className="rounded-lg p-2 text-ink-muted hover:bg-surface"
              >
                <X size={20} />
              </button>
            </div>
            <SidebarContent onNavigate={onClose} />
          </div>
        </div>
      )}
    </>
  );
}
