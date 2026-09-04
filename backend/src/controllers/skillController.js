const { z } = require('zod');
const skillService = require('../services/skillService');
const { success } = require('../utils/apiResponse');

const addSkillSchema = z.object({
  skillId: z.string().uuid('A valid skillId is required'),
  proficiency: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
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

// GET /api/skills — catalog, open to any authenticated user (students
// need it during onboarding; future roles will reuse it too).
async function listSkills(req, res, next) {
  try {
    const { search, category, limit } = req.query;
    const skills = await skillService.listSkills({ search, category, limit });
    return success(res, skills, { count: skills.length });
  } catch (err) {
    return next(err);
  }
}

async function addOrUpdateSkill(req, res, next) {
  try {
    const data = addSkillSchema.parse(req.body);
    const studentSkill = await skillService.addOrUpdateStudentSkill(req.params.id, data);
    return success(
      res,
      {
        id: studentSkill.skill.id,
        name: studentSkill.skill.name,
        category: studentSkill.skill.category,
        proficiency: studentSkill.proficiency,
      },
      null,
      201
    );
  } catch (err) {
    return handleZodError(err, next);
  }
}

async function removeSkill(req, res, next) {
  try {
    await skillService.removeStudentSkill(req.params.id, req.params.skillId);
    return success(res, { removed: true });
  } catch (err) {
    return next(err);
  }
}

module.exports = { listSkills, addOrUpdateSkill, removeSkill };
