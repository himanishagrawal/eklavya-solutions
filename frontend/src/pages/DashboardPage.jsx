import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Target, TrendingUp, GraduationCap, Briefcase, Activity, UserCircle2, Sparkles, ArrowRight,
} from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';
import * as studentService from '../services/studentService.js';

// Phase 3-5 features - unchanged from Phase 1, still intentionally
// reserved and clearly labeled rather than faked.
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

  // PHASE 2: real skill count, fetched from the database - not
  // hard-coded and not stored only in local/session state.
  const [skills, setSkills] = useState(null);

  useEffect(() => {
    if (!student?.id) return;
    studentService
      .getStudent(student.id)
      .then((data) => setSkills(data.skills))
      .catch(() => setSkills([]));
  }, [student?.id]);

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

      {/* PHASE 2: onboarding prompt - soft nudge, never blocks the
          existing dashboard from rendering. */}
      {student && !student.onboardingCompleted && (
        <Card className="mt-6 border-accent/25 bg-gradient-to-br from-accent-soft to-surface" delay={0.02}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft">
                <Sparkles size={20} className="text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">Finish setting up your profile</p>
                <p className="text-xs text-ink-muted">
                  Complete onboarding to unlock accurate recommendations later on.
                </p>
              </div>
            </div>
            <Button as={Link} to="/app/onboarding" variant="primary" icon={ArrowRight}>
              Continue onboarding
            </Button>
          </div>
        </Card>
      )}

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

      {/* PHASE 2: real skills summary, sourced from the database */}
      <Card className="mt-5" delay={0.08}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo/10">
              <Target size={20} className="text-indigo" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink">My skills</p>
              <p className="text-xs text-ink-muted">
                {skills === null ? 'Loading…' : `${skills.length} skill${skills.length === 1 ? '' : 's'} added`}
              </p>
            </div>
          </div>
          <Link to="/app/skills" className="text-sm font-medium text-accent hover:underline">
            Manage →
          </Link>
        </div>
        {skills && skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {skills.slice(0, 8).map((s) => (
              <Badge key={s.id} tone="accent">{s.name}</Badge>
            ))}
            {skills.length > 8 && <Badge tone="neutral">+{skills.length - 8} more</Badge>}
          </div>
        )}
      </Card>

      {/* Placeholder analytics grid - wired for future phases */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FUTURE_CARDS.map((c) => (
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
