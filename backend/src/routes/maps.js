const express = require('express');
const router = express.Router();
const {
  calculateRoute,
  getTripMapData,
  getNearbyAttractions,
} = require('../controllers/mapController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.post('/route', calculateRoute);
router.get('/nearby', getNearbyAttractions);
router.get('/:tripId', getTripMapData);

module.exports = router;
