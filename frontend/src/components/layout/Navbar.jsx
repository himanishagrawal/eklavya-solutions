import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../ui/Logo.jsx';
import Button from '../ui/Button.jsx';
import { useAuth } from '../../hooks/useAuth.js';

const LINKS = [
  { label: 'Platform', href: '#platform' },
  { label: 'For Students', href: '#students' },
  { label: 'For Institutes', href: '#institutes' },
  { label: 'For Employers', href: '#employers' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-surface-border/70 bg-base/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link to="/" aria-label="Eklavya Solutions home">
          <Logo size={30} />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="ghost"
            onClick={() => navigate(isAuthenticated ? '/app/dashboard' : '/login')}
          >
            {isAuthenticated ? 'Dashboard' : 'Log in'}
          </Button>
          <Button variant="primary" onClick={() => navigate('/login')}>
            Get started
          </Button>
        </div>

        <button
          className="rounded-lg p-2 text-ink-muted hover:bg-surface md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-surface-border/70 bg-base md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-surface hover:text-ink"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-3 flex flex-col gap-2">
                <Button variant="secondary" onClick={() => navigate('/login')}>Log in</Button>
                <Button variant="primary" onClick={() => navigate('/login')}>Get started</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
