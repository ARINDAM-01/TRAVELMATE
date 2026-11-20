const express = require('express');
const router = express.Router();
const {
  generateItinerary,
  saveGeneratedItinerary,
  syncTripAiBudget,
  chat,
} = require('../controllers/aiController');
const { authenticateToken } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');

router.use(authenticateToken);

router.post('/generate-itinerary', aiLimiter, generateItinerary);
router.post('/save-itinerary', saveGeneratedItinerary);
router.post('/sync-budget/:tripId', syncTripAiBudget);
router.post('/chat', aiLimiter, chat);

module.exports = router;
