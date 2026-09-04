// PHASE 1: creates the demo student used by "Try Demo" login.
// PHASE 2 (this update): also seeds a real skill catalog and gives
// the demo student actual skills + a completed onboarding state, so
// the full Phase 2 demo journey (profile / skills / target career)
// works immediately after seeding. Nothing from Phase 1 is removed.
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { computeProfileCompletion } = require('../src/utils/profileCompletion');

const prisma = new PrismaClient();

const DEMO_STUDENT = {
  email: 'aarav.sharma@demo.eklavya.in',
  password: 'Demo@1234',
  fullName: 'Aarav Sharma',
  city: 'Indore',
  district: 'Indore',
  state: 'Madhya Pradesh',
  college: 'Institute of Engineering & Technology, DAVV',
  degree: 'B.Tech, Computer Science',
  semester: '7th Semester',
  graduationYear: 2027,
  targetIndustry: 'Information Technology',
  targetRole: 'Data Analyst',
  targetLocation: 'Indore, Madhya Pradesh',
  workPreference: 'HYBRID',
  certifications: 'Google Data Analytics Professional Certificate',
  projects: 'Built a student attendance dashboard using Excel and SQL for a college club.',
  internshipExperience: 'Summer intern (data entry & reporting) at a local logistics firm, 2025.',
  resumeUrl: '',
};

const DEMO_STUDENT_SKILLS = [
  { name: 'Excel', proficiency: 'ADVANCED' },
  { name: 'SQL', proficiency: 'INTERMEDIATE' },
  { name: 'Communication', proficiency: 'ADVANCED' },
  { name: 'Python', proficiency: 'BEGINNER' },
];

// PHASE 2: curated skill catalog. Kept to a solid, realistic set for
// this phase - the full 300+ skill catalog described in the master
// spec is seeded incrementally as later phases need broader coverage.
const SKILL_CATALOG = [
  // Programming & scripting
  ['JavaScript', 'Programming'], ['TypeScript', 'Programming'], ['Python', 'Programming'],
  ['Java', 'Programming'], ['C++', 'Programming'], ['C#', 'Programming'], ['Go', 'Programming'],
  ['SQL', 'Programming'], ['R', 'Programming'], ['PHP', 'Programming'],
  // Web development
  ['HTML', 'Web Development'], ['CSS', 'Web Development'], ['React', 'Web Development'],
  ['Node.js', 'Web Development'], ['Express.js', 'Web Development'], ['Next.js', 'Web Development'],
  ['REST API', 'Web Development'], ['GraphQL', 'Web Development'],
  // Data & analytics
  ['Excel', 'Data & Analytics'], ['Power BI', 'Data & Analytics'], ['Tableau', 'Data & Analytics'],
  ['Data Visualization', 'Data & Analytics'], ['Statistics', 'Data & Analytics'],
  ['Machine Learning', 'Data & Analytics'], ['Pandas', 'Data & Analytics'], ['NumPy', 'Data & Analytics'],
  // Cloud & DevOps
  ['AWS', 'Cloud & DevOps'], ['Azure', 'Cloud & DevOps'], ['Docker', 'Cloud & DevOps'],
  ['Kubernetes', 'Cloud & DevOps'], ['Git', 'Cloud & DevOps'], ['CI/CD', 'Cloud & DevOps'],
  // Databases
  ['MongoDB', 'Databases'], ['PostgreSQL', 'Databases'], ['MySQL', 'Databases'],
  // Design
  ['Figma', 'Design'], ['UI/UX Design', 'Design'], ['Adobe Photoshop', 'Design'],
  // Business & soft skills
  ['Communication', 'Soft Skills'], ['Project Management', 'Soft Skills'],
  ['Problem Solving', 'Soft Skills'], ['Teamwork', 'Soft Skills'], ['Leadership', 'Soft Skills'],
  ['Digital Marketing', 'Business'], ['Content Writing', 'Business'], ['SEO', 'Business'],
  // Cybersecurity
  ['Network Security', 'Cybersecurity'], ['Ethical Hacking', 'Cybersecurity'],
];

async function seedSkillCatalog() {
  for (const [name, category] of SKILL_CATALOG) {
    await prisma.skill.upsert({
      where: { name },
      update: { category },
      create: { name, category },
    });
  }
  // eslint-disable-next-line no-console
  console.log(`[seed] Skill catalog ready: ${SKILL_CATALOG.length} skills`);
}

async function seedDemoStudent() {
  const passwordHash = await bcrypt.hash(DEMO_STUDENT.password, 10);

  const user = await prisma.user.upsert({
    where: { email: DEMO_STUDENT.email },
    update: {},
    create: {
      email: DEMO_STUDENT.email,
      passwordHash,
      role: 'STUDENT',
      isDemo: true,
      student: {
        create: {
          fullName: DEMO_STUDENT.fullName,
          city: DEMO_STUDENT.city,
          district: DEMO_STUDENT.district,
          state: DEMO_STUDENT.state,
          college: DEMO_STUDENT.college,
          degree: DEMO_STUDENT.degree,
          semester: DEMO_STUDENT.semester,
          graduationYear: DEMO_STUDENT.graduationYear,
          targetIndustry: DEMO_STUDENT.targetIndustry,
          targetRole: DEMO_STUDENT.targetRole,
          targetLocation: DEMO_STUDENT.targetLocation,
          workPreference: DEMO_STUDENT.workPreference,
          certifications: DEMO_STUDENT.certifications,
          projects: DEMO_STUDENT.projects,
          internshipExperience: DEMO_STUDENT.internshipExperience,
          resumeUrl: DEMO_STUDENT.resumeUrl,
          onboardingCompleted: true,
        },
      },
    },
    include: { student: true },
  });

  // Attach demo skills (idempotent - safe to re-run the seed script)
  for (const { name, proficiency } of DEMO_STUDENT_SKILLS) {
    const skill = await prisma.skill.findUnique({ where: { name } });
    if (!skill) continue;
    await prisma.studentSkill.upsert({
      where: { studentId_skillId: { studentId: user.student.id, skillId: skill.id } },
      update: { proficiency },
      create: { studentId: user.student.id, skillId: skill.id, proficiency },
    });
  }

  // Recompute a REAL profile completion score from what was just seeded
  // (never hard-code this number - it must reflect actual data).
  const studentWithSkills = await prisma.student.findUnique({
    where: { id: user.student.id },
    include: { studentSkills: true },
  });
  const profileCompletion = computeProfileCompletion(studentWithSkills, studentWithSkills.studentSkills.length);
  await prisma.student.update({ where: { id: user.student.id }, data: { profileCompletion } });

  // eslint-disable-next-line no-console
  console.log(`[seed] Demo student ready: ${user.email} / ${DEMO_STUDENT.password} (profile ${profileCompletion}% complete)`);
}

async function main() {
  await seedSkillCatalog();
  await seedDemoStudent();
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error('[seed] Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
