const { prisma } = require('../config/db');
const { recalculateProfileCompletion } = require('./studentService');

const MAX_LIST_LIMIT = 100;

function skillNotFound() {
  const err = new Error('Skill not found');
  err.status = 404;
  err.expose = true;
  return err;
}

// GET /api/skills?search=&category=&limit= — real catalog data,
// never hard-coded in the frontend.
async function listSkills({ search, category, limit } = {}) {
  const take = Math.min(Number(limit) || 50, MAX_LIST_LIMIT);

  const where = {
    ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
    ...(category ? { category } : {}),
  };

  return prisma.skill.findMany({ where, orderBy: { name: 'asc' }, take });
}

// Adds a skill to a student, or updates the proficiency if it's
// already there (upsert) - covers both "add skill" and "update
// proficiency" from a single endpoint, matching the spec's API list.
async function addOrUpdateStudentSkill(studentId, { skillId, proficiency }) {
  const skill = await prisma.skill.findUnique({ where: { id: skillId } });
  if (!skill) throw skillNotFound();

  await prisma.studentSkill.upsert({
    where: { studentId_skillId: { studentId, skillId } },
    create: { studentId, skillId, proficiency },
    update: { proficiency },
  });

  await recalculateProfileCompletion(studentId);

  return prisma.studentSkill.findUnique({
    where: { studentId_skillId: { studentId, skillId } },
    include: { skill: true },
  });
}

async function removeStudentSkill(studentId, skillId) {
  const existing = await prisma.studentSkill.findUnique({
    where: { studentId_skillId: { studentId, skillId } },
  });
  if (!existing) throw skillNotFound();

  await prisma.studentSkill.delete({ where: { studentId_skillId: { studentId, skillId } } });
  await recalculateProfileCompletion(studentId);
}

module.exports = { listSkills, addOrUpdateStudentSkill, removeStudentSkill };
