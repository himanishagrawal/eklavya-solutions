const { PrismaClient } = require('@prisma/client');

// Single shared Prisma client instance for the whole backend.
// Future phases (skills, jobs, courses, etc.) should import this
// same instance rather than creating new PrismaClient() elsewhere.
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

async function connectDatabase() {
  await prisma.$connect();
  // eslint-disable-next-line no-console
  console.log('[database] PostgreSQL connected via Prisma');
}

module.exports = { prisma, connectDatabase };
