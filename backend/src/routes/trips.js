const express = require('express');
const router = express.Router();
const {
  getTrips,
  createTrip,
  getTrip,
  updateTrip,
  deleteTrip,
  duplicateTrip,
  getDashboardStats,
} = require('../controllers/tripController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/dashboard', getDashboardStats);
router.get('/', getTrips);
router.post('/', createTrip);
router.get('/:id', getTrip);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);
router.post('/:id/duplicate', duplicateTrip);

module.exports = router;
