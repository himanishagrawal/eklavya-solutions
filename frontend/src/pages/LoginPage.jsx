import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import Logo from '../components/ui/Logo.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { validateStudentEmail, validatePassword } from '../utils/validators.js';

const DEMO_CREDENTIALS = {
  email: 'aarav.sharma@demo.eklavya.in',
  password: 'Demo@1234',
};

const demoModeEnabled = (import.meta.env.VITE_ENABLE_DEMO_MODE || 'true') === 'true';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { login, status } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/app/dashboard';

  const runLogin = async (credentials) => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      await login(credentials);
      navigate(from, { replace: true });
    } catch (err) {
      setSubmitError(err.message || 'Unable to log in. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailError = validateStudentEmail(email);
    const passwordError = validatePassword(password);
    const errors = {};
    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    runLogin({ email, password });
  };

  const handleDemoLogin = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setFieldErrors({});
    runLogin(DEMO_CREDENTIALS);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base bg-grid-fade px-5 py-12">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="mb-8 flex justify-center">
          <Link to="/">
            <Logo size={34} />
          </Link>
        </div>

        <div className="surface-card p-8">
          <h1 className="font-display text-2xl font-semibold text-ink">Welcome back</h1>
          <p className="mt-1.5 text-sm text-ink-muted">
            Log in with your student email to see your skill dashboard.
          </p>

          {submitError && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-status-danger/30 bg-status-danger/10 px-4 py-3 text-sm text-status-danger">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            <Input
              id="email"
              type="email"
              label="Student email"
              placeholder="you@college.edu.in"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors.email}
              autoComplete="email"
            />
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              icon={ArrowRight}
              isLoading={submitting || status === 'loading'}
              className="mt-2 w-full"
            >
              Log in
            </Button>
          </form>

          {demoModeEnabled && (
            <>
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-surface-border" />
                <span className="text-xs uppercase tracking-wide text-ink-faint">or</span>
                <div className="h-px flex-1 bg-surface-border" />
              </div>

              <Button
                variant="secondary"
                icon={Sparkles}
                onClick={handleDemoLogin}
                isLoading={submitting}
                className="w-full"
              >
                Try demo student login
              </Button>
              <p className="mt-3 text-center text-xs text-ink-faint">
                Demo mode — signs in as the seeded demo student
                ({DEMO_CREDENTIALS.email})
              </p>
            </>
          )}

          <p className="mt-6 text-center text-sm text-ink-muted">
            New to Eklavya Solutions?{' '}
            <span className="text-accent">Registration opens in a future phase.</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
