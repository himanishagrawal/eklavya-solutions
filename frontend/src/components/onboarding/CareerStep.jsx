import React from 'react';
import Input from '../ui/Input.jsx';
import Select from '../ui/Select.jsx';
import { INDUSTRIES, TARGET_ROLES, WORK_PREFERENCES } from '../../utils/onboardingOptions.js';

export default function CareerStep({ values, errors, onChange }) {
  const set = (field) => (e) => onChange(field, e.target.value);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          id="targetIndustry"
          label="Target industry"
          value={values.targetIndustry}
          onChange={set('targetIndustry')}
          error={errors.targetIndustry}
          placeholder="Select an industry"
          options={INDUSTRIES.map((i) => ({ value: i, label: i }))}
        />
        <Select
          id="targetRole"
          label="Target role"
          value={values.targetRole}
          onChange={set('targetRole')}
          error={errors.targetRole}
          placeholder="Select a target role"
          options={TARGET_ROLES.map((r) => ({ value: r, label: r }))}
        />
        <div className="sm:col-span-2">
          <Input
            id="targetLocation"
            label="Preferred location"
            value={values.targetLocation}
            onChange={set('targetLocation')}
            error={errors.targetLocation}
            placeholder="Indore, Madhya Pradesh"
          />
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-ink-muted">Work preference</p>
        <div className="grid grid-cols-3 gap-3">
          {WORK_PREFERENCES.map((opt) => {
            const active = values.workPreference === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange('workPreference', opt.value)}
                className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors duration-150 ${
                  active
                    ? 'border-accent bg-accent-soft text-accent'
                    : 'border-surface-border bg-surface-elevated text-ink-muted hover:border-accent/40'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        {errors.workPreference && <p className="mt-1.5 text-sm text-status-danger">{errors.workPreference}</p>}
      </div>
    </div>
  );
}
