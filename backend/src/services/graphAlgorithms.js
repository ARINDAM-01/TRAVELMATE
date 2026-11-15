/**
 * Graph Algorithms Service for TravelMate
 *
 * Implements:
 * 1. Dijkstra (Shortest path on non-negative weighted graphs)
 * 2. A* (Heuristic-directed shortest path using Haversine spherical distance)
 * 3. Breadth-First Search (BFS - unweighted shortest hops, level-by-level exploration)
 * 4. Depth-First Search (DFS - path finding and graph traversal)
 * 5. Minimum Spanning Tree (MST using Kruskal's algorithm with Disjoint Set Union)
 * 6. Connected Components identification
 */

/**
 * Builds adjacency list representation from nodes and edges arrays.
 * Supports undirected (default) and directed edge specifications.
 */
function buildAdjacencyList(nodes, edges, forceDirected = false) {
  const nodeMap = new Map();
  const adjacency = new Map();

  for (const node of nodes) {
    nodeMap.set(node.id, node);
    adjacency.set(node.id, []);
  }

  for (const edge of edges) {
    const weight = Number(edge.weight ?? edge.duration ?? edge.distance ?? 1);
    const sourceNeighbors = adjacency.get(edge.sourceId);
    if (sourceNeighbors) {
      sourceNeighbors.push({ to: edge.targetId, weight, edge });
    }

    const isDirected = forceDirected || Boolean(edge.isDirected);
    if (!isDirected) {
      const targetNeighbors = adjacency.get(edge.targetId);
      if (targetNeighbors) {
        targetNeighbors.push({ to: edge.sourceId, weight, edge });
      }
    }
  }

  return { nodeMap, adjacency };
}

/**
 * Computes straight-line Haversine distance in kilometers between two geographic coordinates.
 * Admissible heuristic for spatial A* routing.
 */
function haversineDistance(nodeA, nodeB) {
  if (
    nodeA?.latitude == null ||
    nodeA?.longitude == null ||
    nodeB?.latitude == null ||
    nodeB?.longitude == null
  ) {
    return 0;
  }

  const R = 6371.0; // Earth mean radius in km
  const toRad = Math.PI / 180.0;
  const dLat = (nodeB.latitude - nodeA.latitude) * toRad;
  const dLon = (nodeB.longitude - nodeA.longitude) * toRad;

  const lat1 = nodeA.latitude * toRad;
  const lat2 = nodeB.latitude * toRad;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Dijkstra's shortest path algorithm
 */
function dijkstra(nodes, edges, startId, endId) {
  const { nodeMap, adjacency } = buildAdjacencyList(nodes, edges);

  if (!nodeMap.has(startId)) throw new Error(`Origin node '${startId}' not found in graph`);
  if (!nodeMap.has(endId)) throw new Error(`Destination node '${endId}' not found in graph`);

  if (startId === endId) {
    return {
      path: [startId],
      pathNodes: [nodeMap.get(startId)],
      pathEdges: [],
      totalWeight: 0,
      algorithm: 'dijkstra',
    };
  }

  const dist = new Map();
  const prev = new Map();
  const prevEdge = new Map();
  const visited = new Set();

  for (const id of nodeMap.keys()) {
    dist.set(id, Infinity);
    prev.set(id, null);
  }
  dist.set(startId, 0);

  // Priority queue implementation using simple array
  const pq = [{ id: startId, dist: 0 }];

  while (pq.length > 0) {
    pq.sort((a, b) => a.dist - b.dist);
    const { id: u } = pq.shift();

    if (visited.has(u)) continue;
    visited.add(u);

    if (u === endId) break;

    const neighbors = adjacency.get(u) || [];
    for (const { to: v, weight, edge } of neighbors) {
      if (visited.has(v)) continue;
      const alt = dist.get(u) + weight;
      if (alt < dist.get(v)) {
        dist.set(v, alt);
        prev.set(v, u);
        prevEdge.set(v, edge);
        pq.push({ id: v, dist: alt });
      }
    }
  }

  if (dist.get(endId) === Infinity) {
    return null; // Unreachable
  }

  // Reconstruct path
  const path = [];
  const pathEdges = [];
  let curr = endId;

  while (curr !== null) {
    path.unshift(curr);
    const pe = prevEdge.get(curr);
    if (pe) pathEdges.unshift(pe);
    curr = prev.get(curr);
  }

  return {
    path,
    pathNodes: path.map(id => nodeMap.get(id)),
    pathEdges,
    totalWeight: dist.get(endId),
    algorithm: 'dijkstra',
  };
}

/**
 * A* Pathfinding algorithm using admissible Haversine distance heuristic
 */
function aStar(nodes, edges, startId, endId) {
  const { nodeMap, adjacency } = buildAdjacencyList(nodes, edges);

  if (!nodeMap.has(startId)) throw new Error(`Origin node '${startId}' not found in graph`);
  if (!nodeMap.has(endId)) throw new Error(`Destination node '${endId}' not found in graph`);

  if (startId === endId) {
    return {
      path: [startId],
      pathNodes: [nodeMap.get(startId)],
      pathEdges: [],
      totalWeight: 0,
      algorithm: 'astar',
    };
  }

  const targetNode = nodeMap.get(endId);
  const gScore = new Map();
  const fScore = new Map();
  const prev = new Map();
  const prevEdge = new Map();
  const openSet = new Set([startId]);
  const closedSet = new Set();

  for (const id of nodeMap.keys()) {
    gScore.set(id, Infinity);
    fScore.set(id, Infinity);
    prev.set(id, null);
  }
  gScore.set(startId, 0);
  fScore.set(startId, haversineDistance(nodeMap.get(startId), targetNode));

  while (openSet.size > 0) {
    let current = null;
    let lowestF = Infinity;

    for (const id of openSet) {
      const f = fScore.get(id) ?? Infinity;
      if (current === null || f < lowestF) {
        lowestF = f;
        current = id;
      }
    }

    if (current === null || current === endId) break;

    openSet.delete(current);
    closedSet.add(current);

    const neighbors = adjacency.get(current) || [];
    for (const { to: neighbor, weight, edge } of neighbors) {
      if (closedSet.has(neighbor)) continue;

      const tentativeG = gScore.get(current) + weight;
      if (tentativeG < gScore.get(neighbor)) {
        prev.set(neighbor, current);
        prevEdge.set(neighbor, edge);
        gScore.set(neighbor, tentativeG);
        fScore.set(neighbor, tentativeG + haversineDistance(nodeMap.get(neighbor), targetNode));

        if (!openSet.has(neighbor)) {
          openSet.add(neighbor);
        }
      }
    }
  }

  if (gScore.get(endId) === Infinity) {
    return null;
  }

  const path = [];
  const pathEdges = [];
  let curr = endId;

  while (curr !== null) {
    path.unshift(curr);
    const pe = prevEdge.get(curr);
    if (pe) pathEdges.unshift(pe);
    curr = prev.get(curr);
  }

  return {
    path,
    pathNodes: path.map(id => nodeMap.get(id)),
    pathEdges,
    totalWeight: gScore.get(endId),
    algorithm: 'astar',
  };
}

/**
 * Breadth-First Search (BFS)
 */
function bfs(nodes, edges, startId, endId = null) {
  const { nodeMap, adjacency } = buildAdjacencyList(nodes, edges);

  if (!nodeMap.has(startId)) throw new Error(`Start node '${startId}' not found`);

  const visited = new Set([startId]);
  const queue = [[startId]];
  const traversalOrder = [startId];
  const levels = { [startId]: 0 };

  while (queue.length > 0) {
    const path = queue.shift();
    const node = path[path.length - 1];

    if (endId && node === endId) {
      return {
        found: true,
        path,
        pathNodes: path.map(id => nodeMap.get(id)),
        traversalOrder,
        levels,
        algorithm: 'bfs',
      };
    }

    const neighbors = adjacency.get(node) || [];
    for (const { to: nextNode } of neighbors) {
      if (!visited.has(nextNode)) {
        visited.add(nextNode);
        levels[nextNode] = (levels[node] || 0) + 1;
        traversalOrder.push(nextNode);
        queue.push([...path, nextNode]);
      }
    }
  }

  return {
    found: endId ? false : true,
    traversalOrder,
    traversalNodes: traversalOrder.map(id => nodeMap.get(id)),
    levels,
    algorithm: 'bfs',
  };
}

/**
 * Depth-First Search (DFS)
 */
function dfs(nodes, edges, startId, endId = null) {
  const { nodeMap, adjacency } = buildAdjacencyList(nodes, edges);

  if (!nodeMap.has(startId)) throw new Error(`Start node '${startId}' not found`);

  const visited = new Set();
  const traversalOrder = [];

  function dfsExplore(current, currentPath) {
    visited.add(current);
    traversalOrder.push(current);
    const newPath = [...currentPath, current];

    if (endId && current === endId) {
      return newPath;
    }

    const neighbors = adjacency.get(current) || [];
    for (const { to: nextNode } of neighbors) {
      if (!visited.has(nextNode)) {
        const result = dfsExplore(nextNode, newPath);
        if (result) return result;
      }
    }
    return null;
  }

  const foundPath = dfsExplore(startId, []);

  return {
    found: endId ? Boolean(foundPath) : true,
    path: foundPath,
    pathNodes: foundPath ? foundPath.map(id => nodeMap.get(id)) : null,
    traversalOrder,
    traversalNodes: traversalOrder.map(id => nodeMap.get(id)),
    algorithm: 'dfs',
  };
}

/**
 * Minimum Spanning Tree (MST) using Kruskal's Algorithm with Disjoint Set Union (DSU)
 */
function minimumSpanningTree(nodes, edges) {
  const { nodeMap } = buildAdjacencyList(nodes, edges);
  const parent = new Map();
  const rank = new Map();

  for (const node of nodes) {
    parent.set(node.id, node.id);
    rank.set(node.id, 0);
  }

  function find(i) {
    if (parent.get(i) === i) return i;
    const root = find(parent.get(i));
    parent.set(i, root);
    return root;
  }

  function union(i, j) {
    const rootI = find(i);
    const rootJ = find(j);
    if (rootI === rootJ) return false;

    const rankI = rank.get(rootI);
    const rankJ = rank.get(rootJ);

    if (rankI < rankJ) {
      parent.set(rootI, rootJ);
    } else if (rankI > rankJ) {
      parent.set(rootJ, rootI);
    } else {
      parent.set(rootJ, rootI);
      rank.set(rootI, rankI + 1);
    }
    return true;
  }

  // Sort edges by weight
  const sortedEdges = edges.map(edge => ({
    ...edge,
    weight: Number(edge.weight ?? edge.duration ?? edge.distance ?? 1),
  })).sort((a, b) => a.weight - b.weight);

  const mstEdges = [];
  let totalWeight = 0;

  for (const edge of sortedEdges) {
    if (union(edge.sourceId, edge.targetId)) {
      mstEdges.push(edge);
      totalWeight += edge.weight;
      if (mstEdges.length === nodes.length - 1) break;
    }
  }

  return {
    edges: mstEdges,
    totalWeight,
    nodeCount: nodes.length,
    edgeCount: mstEdges.length,
    algorithm: 'kruskal_mst',
    note: 'MST represents the minimum-cost connecting network across all destinations using duration/distance weights.',
  };
}

/**
 * Connected Components Analysis
 */
function findConnectedComponents(nodes, edges) {
  const { nodeMap, adjacency } = buildAdjacencyList(nodes, edges);
  const visited = new Set();
  const components = [];

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      const comp = [];
      const queue = [node.id];
      visited.add(node.id);

      while (queue.length > 0) {
        const u = queue.shift();
        comp.push(nodeMap.get(u));

        const neighbors = adjacency.get(u) || [];
        for (const { to: v } of neighbors) {
          if (!visited.has(v)) {
            visited.add(v);
            queue.push(v);
          }
        }
      }
      components.push(comp);
    }
  }

  return {
    components,
    componentCount: components.length,
  };
}

module.exports = {
  dijkstra,
  aStar,
  bfs,
  dfs,
  minimumSpanningTree,
  findConnectedComponents,
  buildAdjacencyList,
  haversineDistance,
};
