const bcrypt = require('bcryptjs');
const { prisma } = require('../config/db');
const env = require('../config/env');
const { signAccessToken, signRefreshToken } = require('../utils/jwt');

function isAllowedStudentEmail(email) {
  if (env.allowedStudentDomains.length === 0) return true; // open during early demo phases
  const domain = email.split('@')[1]?.toLowerCase();
  return env.allowedStudentDomains.includes(domain);
}

function buildAuthPayload(user) {
  return { sub: user.id, email: user.email, role: user.role };
}

function issueTokens(user) {
  const payload = buildAuthPayload(user);
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

function toPublicUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    isDemo: user.isDemo,
    student: user.student
      ? {
          id: user.student.id,
          fullName: user.student.fullName,
          profileCompletion: user.student.profileCompletion,
          targetRole: user.student.targetRole,
        }
      : null,
  };
}

async function registerStudent({ email, password, fullName }) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!isAllowedStudentEmail(normalizedEmail)) {
    const err = new Error('Please register using a valid student email address');
    err.status = 400;
    err.expose = true;
    throw err;
  }

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    const err = new Error('An account with this email already exists');
    err.status = 409;
    err.expose = true;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      passwordHash,
      role: 'STUDENT',
      student: { create: { fullName } },
    },
    include: { student: true },
  });

  const tokens = issueTokens(user);
  return { user: toPublicUser(user), ...tokens };
}

async function loginStudent({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: { student: true },
  });

  if (!user) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    err.expose = true;
    throw err;
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    err.expose = true;
    throw err;
  }

  const tokens = issueTokens(user);
  return { user: toPublicUser(user), ...tokens };
}

async function getUserById(id) {
  const user = await prisma.user.findUnique({ where: { id }, include: { student: true } });
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    err.expose = true;
    throw err;
  }
  return toPublicUser(user);
}

module.exports = { registerStudent, loginStudent, getUserById, isAllowedStudentEmail };
