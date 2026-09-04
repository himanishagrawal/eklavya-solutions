import React from 'react';
import Input from '../ui/Input.jsx';
import Select from '../ui/Select.jsx';
import { SEMESTER_OPTIONS } from '../../utils/onboardingOptions.js';

export default function PersonalStep({ values, errors, onChange }) {
  const set = (field) => (e) => onChange(field, e.target.value);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Input id="fullName" label="Full name" value={values.fullName} onChange={set('fullName')} error={errors.fullName} />
      </div>
      <Input id="city" label="City" value={values.city} onChange={set('city')} error={errors.city} placeholder="Indore" />
      <Input id="district" label="District" value={values.district} onChange={set('district')} error={errors.district} placeholder="Indore" />
      <Input id="state" label="State" value={values.state} onChange={set('state')} error={errors.state} placeholder="Madhya Pradesh" />
      <Input id="college" label="College / institution" value={values.college} onChange={set('college')} error={errors.college} placeholder="Your college name" />
      <Input id="degree" label="Degree" value={values.degree} onChange={set('degree')} error={errors.degree} placeholder="B.Tech, Computer Science" />
      <Select
        id="semester"
        label="Semester / year"
        value={values.semester}
        onChange={set('semester')}
        error={errors.semester}
        placeholder="Select your semester"
        options={SEMESTER_OPTIONS.map((s) => ({ value: s, label: s }))}
      />
      <Input
        id="graduationYear"
        type="number"
        label="Graduation year"
        value={values.graduationYear}
        onChange={set('graduationYear')}
        error={errors.graduationYear}
        placeholder="2027"
        min="1990"
        max="2100"
      />
    </div>
  );
}
