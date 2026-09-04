const { computeProfileCompletion } = require('../src/utils/profileCompletion');

describe('computeProfileCompletion (Phase 2)', () => {
  test('returns a low score for a freshly registered student with no data', () => {
    const bareStudent = {
      city: null, district: null, state: null, college: null, degree: null,
      semester: null, graduationYear: null, targetIndustry: null, targetRole: null,
      targetLocation: null, workPreference: null, certifications: null, projects: null,
      internshipExperience: null, resumeUrl: null,
    };
    expect(computeProfileCompletion(bareStudent, 0)).toBe(0);
  });

  test('returns 100 when every field and 5+ skills are present', () => {
    const fullStudent = {
      city: 'Indore', district: 'Indore', state: 'MP', college: 'IET DAVV', degree: 'B.Tech',
      semester: '7th', graduationYear: 2027, targetIndustry: 'IT', targetRole: 'Data Analyst',
      targetLocation: 'Indore', workPreference: 'HYBRID', certifications: 'Cert A',
      projects: 'Project A', internshipExperience: 'Intern A', resumeUrl: 'https://example.com/resume.pdf',
    };
    expect(computeProfileCompletion(fullStudent, 5)).toBe(100);
  });

  test('gives partial credit for a partially completed profile', () => {
    const partialStudent = {
      city: 'Indore', district: null, state: null, college: null, degree: null,
      semester: null, graduationYear: null, targetIndustry: 'IT', targetRole: null,
      targetLocation: null, workPreference: null, certifications: null, projects: null,
      internshipExperience: null, resumeUrl: null,
    };
    const score = computeProfileCompletion(partialStudent, 2);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(100);
  });

  test('never exceeds 100 even with more than the target skill count', () => {
    const fullStudent = {
      city: 'Indore', district: 'Indore', state: 'MP', college: 'IET DAVV', degree: 'B.Tech',
      semester: '7th', graduationYear: 2027, targetIndustry: 'IT', targetRole: 'Data Analyst',
      targetLocation: 'Indore', workPreference: 'HYBRID', certifications: 'Cert A',
      projects: 'Project A', internshipExperience: 'Intern A', resumeUrl: 'https://example.com/resume.pdf',
    };
    expect(computeProfileCompletion(fullStudent, 20)).toBe(100);
  });
});
