const express = require('express');
const router = express.Router();
const { generateItinerary, saveGeneratedItinerary, chat } = require('../controllers/aiController');
const { authenticateToken } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');

router.use(authenticateToken);

router.post('/generate-itinerary', aiLimiter, generateItinerary);
router.post('/save-itinerary', saveGeneratedItinerary);
router.post('/chat', aiLimiter, chat);

module.exports = router;
