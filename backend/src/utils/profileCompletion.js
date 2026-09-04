// PHASE 2: computes a real, data-driven profile completion score.
// Never hard-code this value anywhere else - always derive it here
// from the actual student record + skill count so it stays honest
// as fields are added/removed. Weights sum to 100.

const PERSONAL_FIELDS = ['city', 'district', 'state', 'college', 'degree', 'semester', 'graduationYear'];
const CAREER_FIELDS = ['targetIndustry', 'targetRole', 'targetLocation', 'workPreference'];
const OPTIONAL_FIELDS = ['certifications', 'projects', 'internshipExperience', 'resumeUrl'];

const PERSONAL_WEIGHT = 35; // split across PERSONAL_FIELDS
const CAREER_WEIGHT = 30; // split across CAREER_FIELDS
const SKILLS_WEIGHT = 20; // full weight reached at 5+ skills
const OPTIONAL_WEIGHT = 15; // split across OPTIONAL_FIELDS
const SKILLS_TARGET_COUNT = 5;

function isFilled(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

function computeProfileCompletion(student, skillsCount = 0) {
  const personalScore =
    (PERSONAL_FIELDS.filter((f) => isFilled(student[f])).length / PERSONAL_FIELDS.length) * PERSONAL_WEIGHT;

  const careerScore =
    (CAREER_FIELDS.filter((f) => isFilled(student[f])).length / CAREER_FIELDS.length) * CAREER_WEIGHT;

  const skillsScore = Math.min(skillsCount, SKILLS_TARGET_COUNT) / SKILLS_TARGET_COUNT * SKILLS_WEIGHT;

  const optionalScore =
    (OPTIONAL_FIELDS.filter((f) => isFilled(student[f])).length / OPTIONAL_FIELDS.length) * OPTIONAL_WEIGHT;

  const total = personalScore + careerScore + skillsScore + optionalScore;
  return Math.round(Math.min(100, Math.max(0, total)));
}

module.exports = { computeProfileCompletion, PERSONAL_FIELDS, CAREER_FIELDS, OPTIONAL_FIELDS };
