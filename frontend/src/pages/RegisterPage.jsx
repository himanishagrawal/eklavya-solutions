import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import Logo from '../components/ui/Logo.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { validateStudentEmail, validatePassword } from '../utils/validators.js';

// PHASE 2: registration was already supported by the Phase 1 backend
// (POST /api/auth/register) and AuthContext.register(), but had no
// frontend page yet. This is the smallest addition needed so new
// students can reach the onboarding flow described in Phase 2.
export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, status } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!fullName.trim() || fullName.trim().length < 2) errors.fullName = 'Enter your full name';
    const emailError = validateStudentEmail(email);
    if (emailError) errors.email = emailError;
    const passwordError = validatePassword(password);
    if (passwordError) errors.password = passwordError;
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitError(null);
    setSubmitting(true);
    try {
      await register({ fullName: fullName.trim(), email, password });
      // New students go straight into the onboarding wizard.
      navigate('/app/onboarding', { replace: true });
    } catch (err) {
      setSubmitError(err.message || 'Unable to create your account. Please try again.');
    } finally {
      setSubmitting(false);
    }
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
          <h1 className="font-display text-2xl font-semibold text-ink">Create your account</h1>
          <p className="mt-1.5 text-sm text-ink-muted">
            Set up your student profile to start tracking your skill gap.
          </p>

          {submitError && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-status-danger/30 bg-status-danger/10 px-4 py-3 text-sm text-status-danger">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            <Input
              id="fullName"
              type="text"
              label="Full name"
              placeholder="Aarav Sharma"
              icon={User}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={fieldErrors.fullName}
              autoComplete="name"
            />
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
              placeholder="At least 8 characters"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
              autoComplete="new-password"
            />
            <Input
              id="confirmPassword"
              type="password"
              label="Confirm password"
              placeholder="Re-enter your password"
              icon={Lock}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={fieldErrors.confirmPassword}
              autoComplete="new-password"
            />

            <Button
              type="submit"
              variant="primary"
              icon={ArrowRight}
              isLoading={submitting || status === 'loading'}
              className="mt-2 w-full"
            >
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-accent hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
