const express = require('express');
const router = express.Router();
const {
  getGraph,
  createNode,
  updateNode,
  deleteNode,
  deleteEdge,
} = require('../controllers/graphController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/:tripId', getGraph);
router.post('/nodes', createNode);
router.put('/nodes/:id', updateNode);
router.delete('/nodes/:id', deleteNode);
router.delete('/edges/:id', deleteEdge);

module.exports = router;
