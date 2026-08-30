const express = require('express');
const authRoutes = require('./authRoutes');

const router = express.Router();

router.use('/auth', authRoutes);

// Health check - useful for verifying the backend is reachable
// from the frontend and from deployment platforms.
router.get('/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok', service: 'eklavya-solutions-api' } });
});

module.exports = router;
