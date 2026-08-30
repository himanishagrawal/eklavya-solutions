const { z } = require('zod');
const authService = require('../services/authService');
const { success } = require('../utils/apiResponse');

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

async function register(req, res, next) {
  try {
    const data = registerSchema.parse(req.body);
    const result = await authService.registerStudent(data);
    return success(res, result, null, 201);
  } catch (err) {
    if (err.issues) {
      err.status = 400;
      err.expose = true;
      err.details = err.flatten?.().fieldErrors;
      err.message = 'Validation failed';
    }
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);
    const result = await authService.loginStudent(data);
    return success(res, result);
  } catch (err) {
    if (err.issues) {
      err.status = 400;
      err.expose = true;
      err.details = err.flatten?.().fieldErrors;
      err.message = 'Validation failed';
    }
    return next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await authService.getUserById(req.user.sub);
    return success(res, user);
  } catch (err) {
    return next(err);
  }
}

async function logout(req, res) {
  // Stateless JWT: logout is handled client-side by discarding tokens.
  // Kept as a real endpoint so future phases can add refresh-token
  // revocation / denylisting without changing the frontend contract.
  return success(res, { loggedOut: true });
}

module.exports = { register, login, me, logout };
