import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, GraduationCap, Briefcase, Activity, UserCircle2 } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useAuth } from '../hooks/useAuth.js';

const FUTURE_CARDS = [
  { title: 'Job Readiness Score', icon: Activity, note: 'Calculated once the Skill Gap Engine ships (Phase 3).' },
  { title: 'Skill Match', icon: Target, note: 'Compares your skills to your target role (Phase 3).' },
  { title: 'Recommended Courses', icon: GraduationCap, note: 'Personalized course suggestions (Phase 4).' },
  { title: 'Learning Progress', icon: TrendingUp, note: 'Tracks time spent and completion (Phase 5).' },
  { title: 'Relevant Jobs', icon: Briefcase, note: 'Ranked job matches near you (Phase 5).' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const student = user?.student;
  const firstName = (student?.fullName || 'Student').split(' ')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="mx-auto max-w-7xl">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          {greeting}, {firstName}
        </h1>
        <p className="mt-1.5 text-sm text-ink-muted">
          Target role:{' '}
          <span className="font-medium text-accent">{student?.targetRole || 'Not set yet'}</span>
        </p>
      </motion.div>

      {/* Profile completion - real data from the student record */}
      <Card className="mt-6" delay={0.05}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft">
              <UserCircle2 size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink">Profile completion</p>
              <p className="text-xs text-ink-muted">Complete onboarding to unlock personalized insights</p>
            </div>
          </div>
          <span className="font-display text-xl font-semibold text-ink">
            {student?.profileCompletion ?? 0}%
          </span>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-surface-elevated">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${student?.profileCompletion ?? 0}%` }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="h-full rounded-full bg-gradient-to-r from-accent to-indigo"
          />
        </div>
      </Card>

      {/* Placeholder analytics grid - wired for future phases */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FUTURE_CARDS.map((c, i) => (
          <EmptyState
            key={c.title}
            icon={c.icon}
            title={c.title}
            message={c.note}
            className="animate-fadeUp"
          />
        ))}
      </div>
    </div>
  );
}
