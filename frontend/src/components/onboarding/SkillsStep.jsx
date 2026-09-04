import React, { useEffect, useState } from 'react';
import { Search, Plus, X, Loader2 } from 'lucide-react';
import Input from '../ui/Input.jsx';
import Select from '../ui/Select.jsx';
import Badge from '../ui/Badge.jsx';
import ErrorState from '../ui/ErrorState.jsx';
import { getSkillCatalog } from '../../services/skillService.js';
import { PROFICIENCY_LEVELS } from '../../utils/onboardingOptions.js';

// PHASE 2: skill selection step. Fetches the REAL skill catalog from
// the backend (never hard-coded) and lets the student build up a list
// of {skillId, name, proficiency} which the parent wizard submits on
// final review.
export default function SkillsStep({ selectedSkills, onChangeSkills }) {
  const [catalog, setCatalog] = useState([]);
  const [search, setSearch] = useState('');
  const [loadState, setLoadState] = useState('loading'); // loading | ready | error

  const loadCatalog = async () => {
    setLoadState('loading');
    try {
      const skills = await getSkillCatalog({ search });
      setCatalog(skills);
      setLoadState('ready');
    } catch (err) {
      setLoadState('error');
    }
  };

  useEffect(() => {
    const timeout = setTimeout(loadCatalog, 250); // debounce search
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const selectedIds = new Set(selectedSkills.map((s) => s.skillId));

  const addSkill = (skill) => {
    if (selectedIds.has(skill.id)) return;
    onChangeSkills([...selectedSkills, { skillId: skill.id, name: skill.name, proficiency: 'BEGINNER' }]);
  };

  const removeSkill = (skillId) => {
    onChangeSkills(selectedSkills.filter((s) => s.skillId !== skillId));
  };

  const updateProficiency = (skillId, proficiency) => {
    onChangeSkills(selectedSkills.map((s) => (s.skillId === skillId ? { ...s, proficiency } : s)));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Selected skills */}
      <div>
        <p className="mb-2 text-sm font-medium text-ink-muted">
          Your skills {selectedSkills.length > 0 && `(${selectedSkills.length})`}
        </p>
        {selectedSkills.length === 0 ? (
          <p className="rounded-xl border border-dashed border-surface-border px-4 py-4 text-sm text-ink-faint">
            Search below and add the skills you already have.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {selectedSkills.map((s) => (
              <div
                key={s.skillId}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-surface-border bg-surface-elevated px-4 py-2.5"
              >
                <span className="text-sm font-medium text-ink">{s.name}</span>
                <div className="flex items-center gap-2">
                  <Select
                    id={`proficiency-${s.skillId}`}
                    value={s.proficiency}
                    onChange={(e) => updateProficiency(s.skillId, e.target.value)}
                    options={PROFICIENCY_LEVELS}
                    className="!py-1.5 !text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeSkill(s.skillId)}
                    aria-label={`Remove ${s.name}`}
                    className="rounded-lg p-1.5 text-ink-faint hover:bg-surface hover:text-status-danger"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Catalog search */}
      <div>
        <Input
          id="skillSearch"
          label="Add a skill"
          icon={Search}
          placeholder="Search skills (e.g. React, SQL, Excel)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="mt-3 max-h-64 overflow-y-auto rounded-xl border border-surface-border bg-surface p-2">
          {loadState === 'loading' && (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-ink-muted">
              <Loader2 size={16} className="animate-spin" /> Loading skill catalog…
            </div>
          )}

          {loadState === 'error' && (
            <ErrorState
              title="Couldn't load skills"
              message="Check that the backend is running and try again."
              onRetry={loadCatalog}
              className="border-none bg-transparent p-4 shadow-none"
            />
          )}

          {loadState === 'ready' && catalog.length === 0 && (
            <p className="px-2 py-6 text-center text-sm text-ink-faint">No skills match "{search}".</p>
          )}

          {loadState === 'ready' && catalog.length > 0 && (
            <div className="flex flex-wrap gap-2 p-1">
              {catalog.map((skill) => {
                const alreadyAdded = selectedIds.has(skill.id);
                return (
                  <button
                    key={skill.id}
                    type="button"
                    disabled={alreadyAdded}
                    onClick={() => addSkill(skill)}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
                      alreadyAdded
                        ? 'cursor-not-allowed border-surface-border bg-surface-elevated text-ink-faint'
                        : 'border-surface-border bg-surface-elevated text-ink-muted hover:border-accent/50 hover:text-ink'
                    }`}
                  >
                    {!alreadyAdded && <Plus size={12} />}
                    {skill.name}
                    {skill.category && <Badge tone="neutral" className="ml-1">{skill.category}</Badge>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
