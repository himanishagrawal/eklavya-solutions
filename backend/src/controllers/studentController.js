const { z } = require('zod');
const studentService = require('../services/studentService');
const { success } = require('../utils/apiResponse');

// All fields optional - PUT /students/:id supports partial updates
// from either the onboarding wizard (most fields at once) or the
// profile page (one section at a time).
const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  city: z.string().max(120).optional().nullable(),
  district: z.string().max(120).optional().nullable(),
  state: z.string().max(120).optional().nullable(),
  college: z.string().max(200).optional().nullable(),
  degree: z.string().max(120).optional().nullable(),
  semester: z.string().max(40).optional().nullable(),
  graduationYear: z.coerce.number().int().min(1990).max(2100).optional().nullable(),
  targetIndustry: z.string().max(120).optional().nullable(),
  targetRole: z.string().max(120).optional().nullable(),
  targetLocation: z.string().max(120).optional().nullable(),
  workPreference: z.enum(['REMOTE', 'HYBRID', 'ONSITE']).optional().nullable(),
  certifications: z.string().max(2000).optional().nullable(),
  projects: z.string().max(2000).optional().nullable(),
  internshipExperience: z.string().max(2000).optional().nullable(),
  resumeUrl: z.string().max(500).optional().nullable(),
});

function handleZodError(err, next) {
  if (err.issues) {
    err.status = 400;
    err.expose = true;
    err.details = err.flatten?.().fieldErrors;
    err.message = 'Validation failed';
  }
  return next(err);
}

async function getProfile(req, res, next) {
  try {
    const student = await studentService.getStudentById(req.params.id);
    return success(res, student);
  } catch (err) {
    return next(err);
  }
}

// HTML selects/inputs naturally send '' for "nothing chosen yet",
// but z.enum()/nullable schemas expect null, not ''. Without this,
// saving a profile where e.g. workPreference was never touched would
// fail validation with a confusing 400 - normalize before parsing.
function nullifyEmptyStrings(payload) {
  const result = {};
  for (const [key, value] of Object.entries(payload)) {
    result[key] = value === '' && key !== 'fullName' ? null : value;
  }
  return result;
}

async function updateProfile(req, res, next) {
  try {
    const data = updateProfileSchema.parse(nullifyEmptyStrings(req.body));
    const student = await studentService.updateStudentProfile(req.params.id, data);
    return success(res, student);
  } catch (err) {
    return handleZodError(err, next);
  }
}

async function completeOnboarding(req, res, next) {
  try {
    const student = await studentService.completeOnboarding(req.params.id);
    return success(res, student);
  } catch (err) {
    return next(err);
  }
}

module.exports = { getProfile, updateProfile, completeOnboarding };
