const express = require('express');
const authRoutes = require('./authRoutes');
const studentRoutes = require('./studentRoutes'); // PHASE 2
const skillRoutes = require('./skillRoutes'); // PHASE 2

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/students', studentRoutes); // PHASE 2
router.use('/skills', skillRoutes); // PHASE 2

// Health check - useful for verifying the backend is reachable
// from the frontend and from deployment platforms.
router.get('/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok', service: 'eklavya-solutions-api' } });
});

module.exports = router;
