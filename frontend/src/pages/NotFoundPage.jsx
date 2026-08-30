import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import Logo from '../components/ui/Logo.jsx';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-base px-5 text-center">
      <Logo size={30} />
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft">
        <Compass size={26} className="text-accent" />
      </div>
      <h1 className="font-display text-3xl font-semibold text-ink">Page not found</h1>
      <p className="max-w-sm text-sm text-ink-muted">
        The page you're looking for doesn't exist or hasn't been built yet.
      </p>
      <Button variant="primary" onClick={() => navigate('/')}>
        Back to home
      </Button>
    </div>
  );
}
