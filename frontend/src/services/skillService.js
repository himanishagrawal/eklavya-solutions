import api from './api';

// PHASE 2: skill catalog + student-skill management API calls.

export async function getSkillCatalog({ search, category } = {}) {
  const { data } = await api.get('/skills', { params: { search, category, limit: 100 } });
  return data.data;
}

export async function addOrUpdateStudentSkill(studentId, { skillId, proficiency }) {
  const { data } = await api.post(`/students/${studentId}/skills`, { skillId, proficiency });
  return data.data;
}

export async function removeStudentSkill(studentId, skillId) {
  const { data } = await api.delete(`/students/${studentId}/skills/${skillId}`);
  return data.data;
}
