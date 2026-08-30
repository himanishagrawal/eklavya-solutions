import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Target,
  TrendingUp,
  GraduationCap,
  Briefcase,
  Building2,
  MapPinned,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';

const PIPELINE = [
  { label: 'Industry Demand', icon: Building2 },
  { label: 'Job Roles', icon: Briefcase },
  { label: 'Required Skills', icon: Target },
  { label: 'Skill Gap', icon: TrendingUp },
  { label: 'Learning Path', icon: GraduationCap },
  { label: 'Job Readiness', icon: Sparkles },
];

const AUDIENCES = [
  {
    id: 'students',
    icon: GraduationCap,
    title: 'For Students',
    description:
      'See exactly which skills your target role demands, where your gaps are, and a guided path to close them.',
  },
  {
    id: 'institutes',
    icon: Building2,
    title: 'For Training Institutes',
    description:
      'Check every course against live industry demand and get clear, evidence-based curriculum recommendations.',
  },
  {
    id: 'employers',
    icon: Briefcase,
    title: 'For Employers',
    description:
      'Validate the skills and proficiency levels your roles actually require, and shape the training pipeline that feeds them.',
  },
  {
    id: 'planners',
    icon: MapPinned,
    title: 'For District Planners',
    description:
      'Spot skill shortages and oversupply by district and industry, and plan training capacity around real demand.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-base">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-grid-fade">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface px-3.5 py-1.5 text-xs font-medium text-accent">
              <Sparkles size={14} /> Evidence-based skill intelligence
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] text-ink sm:text-5xl">
              Bridging Skills <br className="hidden sm:block" /> with Industry
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-muted">
              Eklavya Solutions connects real industry demand to student skill
              development — closing the gap between what training programs teach
              and what employers actually need.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="primary" icon={ArrowRight} onClick={() => navigate('/login')}>
                Try the student demo
              </Button>
              <Button variant="secondary" onClick={() => navigate('/login')}>
                Student login
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
            className="relative mx-auto flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80"
          >
            <div className="absolute inset-0 rounded-full bg-target-radial" />
            {[15, 10.5, 6].map((r, i) => (
              <div
                key={r}
                className="absolute rounded-full border border-accent/30"
                style={{ width: `${r * 20}px`, height: `${r * 20}px`, opacity: 0.5 + i * 0.15 }}
              />
            ))}
            <motion.div
              initial={{ opacity: 0, x: -30, y: 30 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
              className="absolute h-1.5 w-40 origin-right rounded-full bg-gradient-to-r from-transparent to-accent"
              style={{ transform: 'rotate(-45deg) translate(30px, -10px)' }}
            />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-accent shadow-glow">
              <Target size={22} className="text-base" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pipeline */}
      <section id="platform" className="border-y border-surface-border/70 bg-base-soft py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <h2 className="text-center font-display text-2xl font-semibold text-ink sm:text-3xl">
            One evidence-based pipeline
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-ink-muted">
            From live industry signals to individual job readiness — every step
            is backed by data, not guesswork.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {PIPELINE.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <React.Fragment key={step.label}>
                  <Card delay={i * 0.06} className="flex w-40 flex-col items-center gap-2 py-5 text-center" hover>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft">
                      <StepIcon size={18} className="text-accent" />
                    </div>
                    <span className="text-xs font-medium text-ink-muted">{step.label}</span>
                  </Card>
                  {i < PIPELINE.length - 1 && (
                    <ArrowRight size={16} className="hidden text-ink-faint md:block" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </section>

      {/* Audiences */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {AUDIENCES.map((a, i) => {
              const AIcon = a.icon;
              return (
                <Card key={a.id} id={a.id} delay={i * 0.08} hover>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo/10">
                    <AIcon size={20} className="text-indigo" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-ink">{a.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{a.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <Card className="flex flex-col items-center gap-5 border-accent/20 bg-gradient-to-br from-surface to-surface-elevated p-10 text-center sm:p-14">
            <BarChart3 size={28} className="text-accent" />
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
              See your skill gap in minutes
            </h2>
            <p className="max-w-md text-sm text-ink-muted">
              Log in as a student to explore your dashboard, or launch the demo
              account to see the full experience instantly.
            </p>
            <Button variant="primary" icon={ArrowRight} onClick={() => navigate('/login')}>
              Get started
            </Button>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
