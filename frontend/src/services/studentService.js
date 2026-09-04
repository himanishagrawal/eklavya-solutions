import api from './api';

// PHASE 2: student profile + onboarding API calls.
// Mirrors the existing authService.js pattern for consistency.

export async function getStudent(studentId) {
  const { data } = await api.get(`/students/${studentId}`);
  return data.data;
}

export async function updateStudent(studentId, payload) {
  const { data } = await api.put(`/students/${studentId}`, payload);
  return data.data;
}

export async function completeOnboarding(studentId) {
  const { data } = await api.post(`/students/${studentId}/onboarding/complete`);
  return data.data;
}
