const { prisma } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');
const algorithms = require('../services/graphAlgorithms');

const getGraph = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.user.id },
    });

    if (!trip) {
      return errorResponse(res, 'Trip not found or unauthorized access', 404);
    }

    const [nodes, edges] = await Promise.all([
      prisma.graphNode.findMany({ where: { tripId } }),
      prisma.graphEdge.findMany({
        where: { tripId },
        include: {
          source: { select: { id: true, name: true, nodeType: true } },
          target: { select: { id: true, name: true, nodeType: true } },
        },
      }),
    ]);

    return successResponse(res, { nodes, edges, tripId });
  } catch (err) {
    next(err);
  }
};

const createNode = async (req, res, next) => {
  try {
    const { tripId, name, nodeType, latitude, longitude, description, imageUrl, metadata, positionX, positionY } = req.body;

    if (!name || !nodeType) {
      return errorResponse(res, 'Node name and nodeType are required', 400);
    }

    if (tripId) {
      const trip = await prisma.trip.findFirst({
        where: { id: tripId, userId: req.user.id },
      });
      if (!trip) return errorResponse(res, 'Trip not found or unauthorized', 404);
    }

    const node = await prisma.graphNode.create({
      data: {
        tripId,
        name,
        nodeType,
        latitude: latitude != null ? parseFloat(latitude) : null,
        longitude: longitude != null ? parseFloat(longitude) : null,
        description,
        imageUrl,
        metadata,
        positionX: positionX != null ? parseFloat(positionX) : null,
        positionY: positionY != null ? parseFloat(positionY) : null,
      },
    });

    return successResponse(res, { node }, 'Graph node created', 201);
  } catch (err) {
    next(err);
  }
};

const updateNode = async (req, res, next) => {
  try {
    const existing = await prisma.graphNode.findUnique({
      where: { id: req.params.id },
      include: { trip: { select: { userId: true } } },
    });

    if (!existing) {
      return errorResponse(res, 'Node not found', 404);
    }

    if (existing.trip && existing.trip.userId !== req.user.id) {
      return errorResponse(res, 'Unauthorized to modify node', 403);
    }

    const { latitude, longitude, positionX, positionY, ...rest } = req.body;
    const node = await prisma.graphNode.update({
      where: { id: req.params.id },
      data: {
        ...rest,
        ...(latitude !== undefined && { latitude: latitude != null ? parseFloat(latitude) : null }),
        ...(longitude !== undefined && { longitude: longitude != null ? parseFloat(longitude) : null }),
        ...(positionX !== undefined && { positionX: positionX != null ? parseFloat(positionX) : null }),
        ...(positionY !== undefined && { positionY: positionY != null ? parseFloat(positionY) : null }),
      },
    });

    return successResponse(res, { node }, 'Graph node updated');
  } catch (err) {
    next(err);
  }
};

const deleteNode = async (req, res, next) => {
  try {
    const existing = await prisma.graphNode.findUnique({
      where: { id: req.params.id },
      include: { trip: { select: { userId: true } } },
    });

    if (!existing) return errorResponse(res, 'Node not found', 404);
    if (existing.trip && existing.trip.userId !== req.user.id) {
      return errorResponse(res, 'Unauthorized', 403);
    }

    await prisma.graphNode.delete({ where: { id: req.params.id } });
    return successResponse(res, null, 'Graph node deleted');
  } catch (err) {
    next(err);
  }
};

const createEdge = async (req, res, next) => {
  try {
    const {
      tripId,
      sourceId,
      targetId,
      edgeType = 'road',
      distance,
      duration,
      transportMode,
      estimatedCost,
      currency,
      weight,
      isDirected = false,
      metadata,
    } = req.body;

    if (!sourceId || !targetId) {
      return errorResponse(res, 'sourceId and targetId are required', 400);
    }

    if (tripId) {
      const trip = await prisma.trip.findFirst({
        where: { id: tripId, userId: req.user.id },
      });
      if (!trip) return errorResponse(res, 'Trip not found or unauthorized', 404);
    }

    const [source, target] = await Promise.all([
      prisma.graphNode.findUnique({ where: { id: sourceId } }),
      prisma.graphNode.findUnique({ where: { id: targetId } }),
    ]);

    if (!source || !target) {
      return errorResponse(res, 'Source or target node does not exist', 404);
    }

    // Default weight based on duration or distance
    const computedWeight = weight != null
      ? parseFloat(weight)
      : (duration != null ? parseFloat(duration) : (distance != null ? parseFloat(distance) : 1));

    const edge = await prisma.graphEdge.create({
      data: {
        tripId,
        sourceId,
        targetId,
        edgeType,
        distance: distance != null ? parseFloat(distance) : null,
        duration: duration != null ? parseFloat(duration) : null,
        transportMode,
        estimatedCost: estimatedCost != null ? parseFloat(estimatedCost) : null,
        currency: currency || 'USD',
        weight: computedWeight,
        isDirected: Boolean(isDirected),
        metadata,
      },
    });

    return successResponse(res, { edge }, 'Graph edge created', 201);
  } catch (err) {
    next(err);
  }
};

const deleteEdge = async (req, res, next) => {
  try {
    const existing = await prisma.graphEdge.findUnique({
      where: { id: req.params.id },
      include: { trip: { select: { userId: true } } },
    });

    if (!existing) return errorResponse(res, 'Edge not found', 404);
    if (existing.trip && existing.trip.userId !== req.user.id) {
      return errorResponse(res, 'Unauthorized', 403);
    }

    await prisma.graphEdge.delete({ where: { id: req.params.id } });
    return successResponse(res, null, 'Graph edge deleted');
  } catch (err) {
    next(err);
  }
};

const findShortestPath = async (req, res, next) => {
  try {
    const { startId, endId, tripId, algorithm = 'dijkstra' } = req.body;

    if (!startId || !endId) {
      return errorResponse(res, 'startId and endId are required for route calculation', 400);
    }

    let nodes = [];
    let edges = [];

    if (tripId) {
      const trip = await prisma.trip.findFirst({
        where: { id: tripId, userId: req.user.id },
      });
      if (!trip) return errorResponse(res, 'Trip not found or unauthorized', 404);

      [nodes, edges] = await Promise.all([
        prisma.graphNode.findMany({ where: { tripId } }),
        prisma.graphEdge.findMany({ where: { tripId } }),
      ]);
    } else {
      [nodes, edges] = await Promise.all([
        prisma.graphNode.findMany(),
        prisma.graphEdge.findMany(),
      ]);
    }

    let result = null;
    switch (algorithm.toLowerCase()) {
      case 'astar':
      case 'a*':
        result = algorithms.aStar(nodes, edges, startId, endId);
        break;
      case 'bfs':
        result = algorithms.bfs(nodes, edges, startId, endId);
        break;
      case 'dfs':
        result = algorithms.dfs(nodes, edges, startId, endId);
        break;
      case 'dijkstra':
      default:
        result = algorithms.dijkstra(nodes, edges, startId, endId);
        break;
    }

    if (!result || (result.found === false) || (result.path == null)) {
      return errorResponse(res, 'No connected route found between the selected locations', 404);
    }

    return successResponse(res, { result, algorithm });
  } catch (err) {
    next(err);
  }
};

const getMinimumSpanningTree = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.user.id },
    });
    if (!trip) return errorResponse(res, 'Trip not found', 404);

    const [nodes, edges] = await Promise.all([
      prisma.graphNode.findMany({ where: { tripId } }),
      prisma.graphEdge.findMany({ where: { tripId } }),
    ]);

    const mst = algorithms.minimumSpanningTree(nodes, edges);
    return successResponse(res, mst);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getGraph,
  createNode,
  updateNode,
  deleteNode,
  createEdge,
  deleteEdge,
  findShortestPath,
  getMinimumSpanningTree,
};
