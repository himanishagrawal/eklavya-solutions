import React from 'react';
import Textarea from '../ui/Textarea.jsx';
import Input from '../ui/Input.jsx';
import Badge from '../ui/Badge.jsx';

export default function ReviewStep({ values, selectedSkills, onChange }) {
  const set = (field) => (e) => onChange(field, e.target.value);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4">
        <Textarea
          id="certifications"
          label="Certifications (optional)"
          placeholder="e.g. Google Data Analytics Professional Certificate"
          value={values.certifications}
          onChange={set('certifications')}
        />
        <Textarea
          id="projects"
          label="Projects (optional)"
          placeholder="Briefly describe a project you've built"
          value={values.projects}
          onChange={set('projects')}
        />
        <Textarea
          id="internshipExperience"
          label="Internship experience (optional)"
          placeholder="Company, role, and what you worked on"
          value={values.internshipExperience}
          onChange={set('internshipExperience')}
        />
        <Input
          id="resumeUrl"
          label="Resume link (optional)"
          placeholder="https://drive.google.com/..."
          value={values.resumeUrl}
          onChange={set('resumeUrl')}
        />
      </div>

      <div className="surface-card !shadow-none bg-surface-elevated p-5">
        <h3 className="font-display text-sm font-semibold text-ink">Review your details</h3>
        <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <ReviewRow label="Name" value={values.fullName} />
          <ReviewRow label="College" value={values.college} />
          <ReviewRow label="Location" value={[values.city, values.state].filter(Boolean).join(', ')} />
          <ReviewRow label="Target role" value={values.targetRole} />
          <ReviewRow label="Target industry" value={values.targetIndustry} />
          <ReviewRow label="Work preference" value={values.workPreference} />
        </dl>
        <div className="mt-4">
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-ink-faint">
            Skills ({selectedSkills.length})
          </p>
          {selectedSkills.length === 0 ? (
            <p className="text-sm text-ink-faint">No skills added yet.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {selectedSkills.map((s) => (
                <Badge key={s.skillId} tone="accent">
                  {s.name} · {s.proficiency.charAt(0) + s.proficiency.slice(1).toLowerCase()}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-surface-border/60 py-1.5 sm:border-none sm:py-0">
      <dt className="text-ink-faint">{label}</dt>
      <dd className="font-medium text-ink">{value || '—'}</dd>
    </div>
  );
}
