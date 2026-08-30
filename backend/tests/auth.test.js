const { isAllowedStudentEmail } = require('../src/services/authService');

describe('authService.isAllowedStudentEmail', () => {
  const originalEnvModule = require('../src/config/env');

  test('allows any email when no domain restriction is configured', () => {
    originalEnvModule.allowedStudentDomains = [];
    expect(isAllowedStudentEmail('student@gmail.com')).toBe(true);
  });

  test('rejects emails outside the configured domain list', () => {
    originalEnvModule.allowedStudentDomains = ['college.edu.in'];
    expect(isAllowedStudentEmail('student@gmail.com')).toBe(false);
    expect(isAllowedStudentEmail('student@college.edu.in')).toBe(true);
  });
});
