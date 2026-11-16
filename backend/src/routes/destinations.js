const express = require('express');
const router = express.Router();
const {
  getIndianStates,
  getDestinationsByState,
  getDestinations,
  getDestination,
  searchDestinations,
  getAttractions,
} = require('../controllers/destinationController');

router.get('/states', getIndianStates);
router.get('/state/:stateName', getDestinationsByState);
router.get('/search', searchDestinations);
router.get('/', getDestinations);
router.get('/:id', getDestination);
router.get('/:id/attractions', getAttractions);

module.exports = router;
