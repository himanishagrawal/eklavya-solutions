const express = require('express');
const studentController = require('../controllers/studentController');
const skillController = require('../controllers/skillController');
const { requireAuth } = require('../middleware/auth');
const { roleGuard } = require('../middleware/roleGuard');
const { requireOwnStudent } = require('../middleware/ownership');

const router = express.Router();

// Every route below requires a logged-in STUDENT who owns the :id
// resource - a student can never read or modify another student's
// profile or skills through these endpoints. The chain is applied
// per-route (not via a blanket router.use) so req.params.id is
// guaranteed to be populated before requireOwnStudent runs.
const guard = [requireAuth, roleGuard('STUDENT'), requireOwnStudent];

router.get('/:id', ...guard, studentController.getProfile);
router.put('/:id', ...guard, studentController.updateProfile);
router.post('/:id/onboarding/complete', ...guard, studentController.completeOnboarding);

router.post('/:id/skills', ...guard, skillController.addOrUpdateSkill);
router.delete('/:id/skills/:skillId', ...guard, skillController.removeSkill);

module.exports = router;
