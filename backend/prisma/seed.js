// Phase 1 seed: creates the demo student used by "Try Demo" login.
// Later phases will extend this file with skills, jobs, courses,
// districts, etc. Do not remove the demo student created here.
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const DEMO_STUDENT = {
  email: 'aarav.sharma@demo.eklavya.in',
  password: 'Demo@1234',
  fullName: 'Aarav Sharma',
  city: 'Indore',
  district: 'Indore',
  state: 'Madhya Pradesh',
  targetIndustry: 'Information Technology',
  targetRole: 'Data Analyst',
  workPreference: 'HYBRID',
};

async function main() {
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
          targetIndustry: DEMO_STUDENT.targetIndustry,
          targetRole: DEMO_STUDENT.targetRole,
          workPreference: DEMO_STUDENT.workPreference,
          profileCompletion: 40,
        },
      },
    },
  });

  // eslint-disable-next-line no-console
  console.log(`[seed] Demo student ready: ${user.email} / ${DEMO_STUDENT.password}`);
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
