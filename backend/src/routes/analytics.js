const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/expenseController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);
router.get('/:tripId', getAnalytics);

module.exports = router;
