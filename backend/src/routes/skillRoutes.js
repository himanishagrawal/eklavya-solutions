const express = require('express');
const skillController = require('../controllers/skillController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Catalog read is open to any authenticated user - it has no
// per-student data, so no ownership check is needed here.
router.get('/', requireAuth, skillController.listSkills);

module.exports = router;
