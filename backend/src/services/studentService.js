const { prisma } = require('../config/db');
const { computeProfileCompletion } = require('../utils/profileCompletion');

// Fields a student is allowed to edit themselves via PUT /students/:id.
// Deliberately excludes id/userId/profileCompletion/onboardingCompleted -
// those are either immutable or backend-derived.
const EDITABLE_FIELDS = [
  'fullName',
  'city',
  'district',
  'state',
  'college',
  'degree',
  'semester',
  'graduationYear',
  'targetIndustry',
  'targetRole',
  'targetLocation',
  'workPreference',
  'certifications',
  'projects',
  'internshipExperience',
  'resumeUrl',
];

function notFound() {
  const err = new Error('Student profile not found');
  err.status = 404;
  err.expose = true;
  return err;
}

function toPublicSkill(studentSkill) {
  return {
    id: studentSkill.skill.id,
    name: studentSkill.skill.name,
    category: studentSkill.skill.category,
    proficiency: studentSkill.proficiency,
    addedAt: studentSkill.createdAt,
  };
}

function toPublicStudent(student) {
  return {
    id: student.id,
    email: student.user?.email,
    fullName: student.fullName,
    city: student.city,
    district: student.district,
    state: student.state,
    college: student.college,
    degree: student.degree,
    semester: student.semester,
    graduationYear: student.graduationYear,
    targetIndustry: student.targetIndustry,
    targetRole: student.targetRole,
    targetLocation: student.targetLocation,
    workPreference: student.workPreference,
    certifications: student.certifications,
    projects: student.projects,
    internshipExperience: student.internshipExperience,
    resumeUrl: student.resumeUrl,
    onboardingCompleted: student.onboardingCompleted,
    profileCompletion: student.profileCompletion,
    skills: (student.studentSkills || []).map(toPublicSkill),
    createdAt: student.createdAt,
    updatedAt: student.updatedAt,
  };
}

async function getStudentById(studentId) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      user: { select: { email: true } },
      studentSkills: { include: { skill: true }, orderBy: { createdAt: 'asc' } },
    },
  });
  if (!student) throw notFound();
  return toPublicStudent(student);
}

// Recomputes and persists profileCompletion from the CURRENT database
// state (never trusts a client-supplied percentage).
async function recalculateProfileCompletion(studentId) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { studentSkills: true },
  });
  if (!student) throw notFound();

  const profileCompletion = computeProfileCompletion(student, student.studentSkills.length);

  return prisma.student.update({
    where: { id: studentId },
    data: { profileCompletion },
  });
}

async function updateStudentProfile(studentId, payload) {
  const data = {};
  for (const field of EDITABLE_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      data[field] = payload[field];
    }
  }

  const existing = await prisma.student.findUnique({ where: { id: studentId } });
  if (!existing) throw notFound();

  await prisma.student.update({ where: { id: studentId }, data });
  await recalculateProfileCompletion(studentId);

  return getStudentById(studentId);
}

async function completeOnboarding(studentId) {
  const existing = await prisma.student.findUnique({ where: { id: studentId } });
  if (!existing) throw notFound();

  await prisma.student.update({
    where: { id: studentId },
    data: { onboardingCompleted: true },
  });
  await recalculateProfileCompletion(studentId);

  return getStudentById(studentId);
}

module.exports = {
  getStudentById,
  updateStudentProfile,
  completeOnboarding,
  recalculateProfileCompletion,
  toPublicStudent,
  EDITABLE_FIELDS,
};
