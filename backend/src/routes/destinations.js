const express = require('express');
const router = express.Router();
const {
  getDestinations,
  getDestination,
  searchDestinations,
  getAttractions,
} = require('../controllers/destinationController');

router.get('/search', searchDestinations);
router.get('/', getDestinations);
router.get('/:id', getDestination);
router.get('/:id/attractions', getAttractions);

module.exports = router;
