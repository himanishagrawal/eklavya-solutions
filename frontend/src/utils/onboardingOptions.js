// PHASE 2: static option lists for onboarding/profile selects.
// Deliberately NOT modeled as DB tables yet - full industry/job-role
// relational modeling belongs to Phase 3 (Industry/job database).
// Target role is stored as free text on Student so Phase 3 can layer
// real skill-gap matching on top without a schema rewrite.

export const INDUSTRIES = [
  'Information Technology',
  'Data & Analytics',
  'Finance & Banking',
  'Healthcare',
  'E-commerce & Retail',
  'Manufacturing',
  'Education',
  'Telecommunications',
  'Automotive & EV',
  'Media & Entertainment',
  'Government & Public Sector',
  'Other',
];

export const TARGET_ROLES = [
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Data Analyst',
  'Data Scientist',
  'Machine Learning Engineer',
  'DevOps Engineer',
  'Cybersecurity Analyst',
  'UI/UX Designer',
  'Product Manager',
  'QA Engineer',
  'Digital Marketing Specialist',
  'Business Analyst',
  'Cloud Engineer',
  'Other',
];

export const WORK_PREFERENCES = [
  { value: 'REMOTE', label: 'Remote' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'ONSITE', label: 'On-site' },
];

export const PROFICIENCY_LEVELS = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
];

export const SEMESTER_OPTIONS = [
  '1st Semester', '2nd Semester', '3rd Semester', '4th Semester',
  '5th Semester', '6th Semester', '7th Semester', '8th Semester', 'Graduated',
];
