const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email) {
  return EMAIL_REGEX.test(String(email || '').trim());
}

// Student email validation: format check + optional allowed-domain check.
// The domain allow-list itself is enforced authoritatively on the backend;
// this mirrors it client-side for immediate feedback.
export function validateStudentEmail(email, allowedDomains = []) {
  const value = String(email || '').trim();
  if (!value) return 'Email is required';
  if (!isValidEmail(value)) return 'Enter a valid email address';
  if (allowedDomains.length > 0) {
    const domain = value.split('@')[1]?.toLowerCase();
    if (!allowedDomains.includes(domain)) {
      return `Use your student email (allowed: ${allowedDomains.join(', ')})`;
    }
  }
  return null;
}

export function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  return null;
}
