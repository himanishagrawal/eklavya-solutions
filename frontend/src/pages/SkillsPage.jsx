import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, X, Target, Loader2 } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';
import Badge from '../components/ui/Badge.jsx';
import LoadingScreen from '../components/ui/LoadingScreen.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useAuth } from '../hooks/useAuth.js';
import * as studentService from '../services/studentService.js';
import * as skillService from '../services/skillService.js';
import { PROFICIENCY_LEVELS } from '../utils/onboardingOptions.js';

const PROFICIENCY_TONE = { BEGINNER: 'neutral', INTERMEDIATE: 'indigo', ADVANCED: 'success' };

export default function SkillsPage() {
  const { user } = useAuth();
  const studentId = user?.student?.id;

  const [mySkills, setMySkills] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [search, setSearch] = useState('');
  const [loadState, setLoadState] = useState('loading'); // loading | ready | error
  const [pendingSkillId, setPendingSkillId] = useState(null); // disables buttons mid-request
  const [actionError, setActionError] = useState(null);

  const loadAll = async () => {
    if (!studentId) return;
    setLoadState('loading');
    try {
      const [profile, skills] = await Promise.all([
        studentService.getStudent(studentId),
        skillService.getSkillCatalog({ search }),
      ]);
      setMySkills(profile.skills);
      setCatalog(skills);
      setLoadState('ready');
    } catch (err) {
      setLoadState('error');
    }
  };

  useEffect(() => {
    const timeout = setTimeout(loadAll, search ? 250 : 0);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId, search]);

  const mySkillIds = new Set(mySkills.map((s) => s.id));

  const addSkill = async (skill) => {
    setActionError(null);
    setPendingSkillId(skill.id);
    try {
      await skillService.addOrUpdateStudentSkill(studentId, { skillId: skill.id, proficiency: 'BEGINNER' });
      setMySkills((prev) => [...prev, { id: skill.id, name: skill.name, category: skill.category, proficiency: 'BEGINNER' }]);
    } catch (err) {
      setActionError(err.message || 'Could not add that skill.');
    } finally {
      setPendingSkillId(null);
    }
  };

  const updateProficiency = async (skillId, proficiency) => {
    setActionError(null);
    setPendingSkillId(skillId);
    const previous = mySkills;
    setMySkills((prev) => prev.map((s) => (s.id === skillId ? { ...s, proficiency } : s)));
    try {
      await skillService.addOrUpdateStudentSkill(studentId, { skillId, proficiency });
    } catch (err) {
      setMySkills(previous); // revert on failure
      setActionError(err.message || 'Could not update proficiency.');
    } finally {
      setPendingSkillId(null);
    }
  };

  const removeSkill = async (skillId) => {
    setActionError(null);
    setPendingSkillId(skillId);
    const previous = mySkills;
    setMySkills((prev) => prev.filter((s) => s.id !== skillId));
    try {
      await skillService.removeStudentSkill(studentId, skillId);
    } catch (err) {
      setMySkills(previous); // revert on failure
      setActionError(err.message || 'Could not remove that skill.');
    } finally {
      setPendingSkillId(null);
    }
  };

  if (loadState === 'loading' && mySkills.length === 0) {
    return <LoadingScreen label="Loading your skills" />;
  }

  if (loadState === 'error') {
    return <ErrorState title="Couldn't load your skills" onRetry={loadAll} className="mx-auto mt-10 max-w-lg" />;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">My Skills</h1>
        <p className="mt-1.5 text-sm text-ink-muted">
          Add every skill you have and keep proficiency up to date - this powers your skill-gap
          analysis in a future phase.
        </p>
      </motion.div>

      {actionError && (
        <div className="mt-5 rounded-xl border border-status-danger/30 bg-status-danger/10 px-4 py-3 text-sm text-status-danger">
          {actionError}
        </div>
      )}

      <Card className="mt-6">
        <h2 className="font-display text-base font-semibold text-ink">
          Your skills {mySkills.length > 0 && `(${mySkills.length})`}
        </h2>

        {mySkills.length === 0 ? (
          <EmptyState
            icon={Target}
            title="No skills added yet"
            message="Search the catalog below and add your first skill."
            className="mt-4 border-none bg-transparent shadow-none"
          />
        ) : (
          <div className="mt-4 flex flex-col gap-2">
            {mySkills.map((s) => (
              <div
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-surface-border bg-surface-elevated px-4 py-2.5"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-ink">{s.name}</span>
                  {s.category && <Badge tone={PROFICIENCY_TONE[s.proficiency]}>{s.category}</Badge>}
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    id={`proficiency-${s.id}`}
                    value={s.proficiency}
                    onChange={(e) => updateProficiency(s.id, e.target.value)}
                    options={PROFICIENCY_LEVELS}
                    disabled={pendingSkillId === s.id}
                    className="!py-1.5 !text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeSkill(s.id)}
                    disabled={pendingSkillId === s.id}
                    aria-label={`Remove ${s.name}`}
                    className="rounded-lg p-1.5 text-ink-faint hover:bg-surface hover:text-status-danger disabled:opacity-50"
                  >
                    {pendingSkillId === s.id ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="mt-5" delay={0.05}>
        <h2 className="font-display text-base font-semibold text-ink">Add a skill</h2>
        <div className="mt-4">
          <Input
            id="skillSearch"
            icon={Search}
            placeholder="Search skills (e.g. React, SQL, Excel)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="mt-3 flex flex-wrap gap-2">
            {catalog.map((skill) => {
              const alreadyAdded = mySkillIds.has(skill.id);
              return (
                <button
                  key={skill.id}
                  type="button"
                  disabled={alreadyAdded || pendingSkillId === skill.id}
                  onClick={() => addSkill(skill)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
                    alreadyAdded
                      ? 'cursor-not-allowed border-surface-border bg-surface-elevated text-ink-faint'
                      : 'border-surface-border bg-surface-elevated text-ink-muted hover:border-accent/50 hover:text-ink'
                  }`}
                >
                  {pendingSkillId === skill.id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : !alreadyAdded ? (
                    <Plus size={12} />
                  ) : null}
                  {skill.name}
                </button>
              );
            })}
            {catalog.length === 0 && loadState === 'ready' && (
              <p className="py-4 text-sm text-ink-faint">No skills match "{search}".</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
