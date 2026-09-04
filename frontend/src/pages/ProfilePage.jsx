import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, AlertCircle, CheckCircle2, Target } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';
import Textarea from '../components/ui/Textarea.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import LoadingScreen from '../components/ui/LoadingScreen.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import { useAuth } from '../hooks/useAuth.js';
import * as studentService from '../services/studentService.js';
import { INDUSTRIES, TARGET_ROLES, WORK_PREFERENCES, SEMESTER_OPTIONS } from '../utils/onboardingOptions.js';

const EDITABLE_FIELDS = [
  'fullName', 'city', 'district', 'state', 'college', 'degree', 'semester', 'graduationYear',
  'targetIndustry', 'targetRole', 'targetLocation', 'workPreference',
  'certifications', 'projects', 'internshipExperience', 'resumeUrl',
];

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const studentId = user?.student?.id;

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);
  const [loadState, setLoadState] = useState('loading'); // loading | ready | error
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [savedAt, setSavedAt] = useState(null);

  const loadProfile = async () => {
    if (!studentId) return;
    setLoadState('loading');
    try {
      const data = await studentService.getStudent(studentId);
      setProfile(data);
      const formValues = {};
      EDITABLE_FIELDS.forEach((f) => (formValues[f] = data[f] ?? ''));
      setForm(formValues);
      setLoadState('ready');
    } catch (err) {
      setLoadState('error');
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setSavedAt(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      const payload = { ...form, graduationYear: form.graduationYear ? Number(form.graduationYear) : null };
      const updated = await studentService.updateStudent(studentId, payload);
      setProfile(updated);
      await refreshUser();
      setSavedAt(new Date());
    } catch (err) {
      setSaveError(err.message || 'Could not save your changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loadState === 'loading' || !form) {
    return <LoadingScreen label="Loading your profile" />;
  }

  if (loadState === 'error') {
    return <ErrorState title="Couldn't load your profile" onRetry={loadProfile} className="mx-auto mt-10 max-w-lg" />;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">My Profile</h1>
        <p className="mt-1.5 text-sm text-ink-muted">
          Keep your details current so recommendations stay accurate.
        </p>
      </motion.div>

      <form onSubmit={handleSave} className="mt-6 flex flex-col gap-6">
        {saveError && (
          <div className="flex items-start gap-2.5 rounded-xl border border-status-danger/30 bg-status-danger/10 px-4 py-3 text-sm text-status-danger">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        <Card>
          <h2 className="font-display text-base font-semibold text-ink">Personal information</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input id="fullName" label="Full name" value={form.fullName} onChange={handleChange('fullName')} />
            </div>
            <Input id="city" label="City" value={form.city} onChange={handleChange('city')} />
            <Input id="district" label="District" value={form.district} onChange={handleChange('district')} />
            <Input id="state" label="State" value={form.state} onChange={handleChange('state')} />
            <Input id="college" label="College / institution" value={form.college} onChange={handleChange('college')} />
            <Input id="degree" label="Degree" value={form.degree} onChange={handleChange('degree')} />
            <Select
              id="semester"
              label="Semester / year"
              value={form.semester}
              onChange={handleChange('semester')}
              placeholder="Select your semester"
              options={SEMESTER_OPTIONS.map((s) => ({ value: s, label: s }))}
            />
            <Input
              id="graduationYear"
              type="number"
              label="Graduation year"
              value={form.graduationYear}
              onChange={handleChange('graduationYear')}
            />
          </div>
        </Card>

        <Card delay={0.05}>
          <h2 className="font-display text-base font-semibold text-ink">Career preferences</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Select
              id="targetIndustry"
              label="Target industry"
              value={form.targetIndustry}
              onChange={handleChange('targetIndustry')}
              placeholder="Select an industry"
              options={INDUSTRIES.map((i) => ({ value: i, label: i }))}
            />
            <Select
              id="targetRole"
              label="Target role"
              value={form.targetRole}
              onChange={handleChange('targetRole')}
              placeholder="Select a target role"
              options={TARGET_ROLES.map((r) => ({ value: r, label: r }))}
            />
            <div className="sm:col-span-2">
              <Input id="targetLocation" label="Preferred location" value={form.targetLocation} onChange={handleChange('targetLocation')} />
            </div>
            <Select
              id="workPreference"
              label="Work preference"
              value={form.workPreference}
              onChange={handleChange('workPreference')}
              placeholder="Select a preference"
              options={WORK_PREFERENCES}
            />
          </div>
        </Card>

        <Card delay={0.1}>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-ink">Skills</h2>
            <Link to="/app/skills" className="text-sm font-medium text-accent hover:underline">
              Manage skills →
            </Link>
          </div>
          {profile.skills.length === 0 ? (
            <p className="mt-3 text-sm text-ink-faint">
              No skills added yet. Visit "My Skills" to add your first one.
            </p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.skills.map((s) => (
                <Badge key={s.id} tone="accent">
                  {s.name} · {s.proficiency.charAt(0) + s.proficiency.slice(1).toLowerCase()}
                </Badge>
              ))}
            </div>
          )}
        </Card>

        <Card delay={0.15}>
          <h2 className="font-display text-base font-semibold text-ink">Additional information</h2>
          <div className="mt-4 flex flex-col gap-4">
            <Textarea id="certifications" label="Certifications" value={form.certifications} onChange={handleChange('certifications')} />
            <Textarea id="projects" label="Projects" value={form.projects} onChange={handleChange('projects')} />
            <Textarea id="internshipExperience" label="Internship experience" value={form.internshipExperience} onChange={handleChange('internshipExperience')} />
            <Input id="resumeUrl" label="Resume link" value={form.resumeUrl} onChange={handleChange('resumeUrl')} />
          </div>
        </Card>

        <div className="flex items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-2 text-sm text-ink-muted">
            <Target size={16} className="text-accent" />
            Profile completion:{' '}
            <span className="font-semibold text-ink">{profile.profileCompletion}%</span>
          </div>
          <div className="flex items-center gap-3">
            {savedAt && (
              <span className="flex items-center gap-1.5 text-sm text-status-success">
                <CheckCircle2 size={16} /> Saved
              </span>
            )}
            <Button type="submit" variant="primary" icon={Save} isLoading={saving}>
              Save changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
