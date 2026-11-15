const express = require('express');
const router = express.Router();
const {
  getGraph,
  createNode,
  updateNode,
  deleteNode,
  createEdge,
  deleteEdge,
  findShortestPath,
  getMinimumSpanningTree,
} = require('../controllers/graphController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/:tripId', getGraph);
router.get('/:tripId/mst', getMinimumSpanningTree);
router.post('/nodes', createNode);
router.put('/nodes/:id', updateNode);
router.delete('/nodes/:id', deleteNode);
router.post('/edges', createEdge);
router.delete('/edges/:id', deleteEdge);
router.post('/shortest-path', findShortestPath);

module.exports = router;
