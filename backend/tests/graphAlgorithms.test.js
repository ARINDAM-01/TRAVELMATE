const {
  dijkstra,
  aStar,
  bfs,
  dfs,
  minimumSpanningTree,
  findConnectedComponents,
} = require('../src/services/graphAlgorithms');

describe('TravelMate Graph Algorithms Service', () => {
  // Sample test graph representing European travel network
  const nodes = [
    { id: 'london', name: 'London', latitude: 51.5074, longitude: -0.1278 },
    { id: 'paris', name: 'Paris', latitude: 48.8566, longitude: 2.3522 },
    { id: 'brussels', name: 'Brussels', latitude: 50.8503, longitude: 4.3517 },
    { id: 'amsterdam', name: 'Amsterdam', latitude: 52.3676, longitude: 4.9041 },
    { id: 'berlin', name: 'Berlin', latitude: 52.5200, longitude: 13.4050 },
    { id: 'isolated', name: 'Isolated Island', latitude: 0.0, longitude: 0.0 },
  ];

  const edges = [
    { id: 'e1', sourceId: 'london', targetId: 'paris', weight: 135, duration: 135, distance: 450 },
    { id: 'e2', sourceId: 'london', targetId: 'brussels', weight: 120, duration: 120, distance: 370 },
    { id: 'e3', sourceId: 'paris', targetId: 'brussels', weight: 85, duration: 85, distance: 310 },
    { id: 'e4', sourceId: 'brussels', targetId: 'amsterdam', weight: 110, duration: 110, distance: 210 },
    { id: 'e5', sourceId: 'amsterdam', targetId: 'berlin', weight: 360, duration: 360, distance: 650 },
    { id: 'e6', sourceId: 'paris', targetId: 'berlin', weight: 500, duration: 500, distance: 1050 },
  ];

  describe('Dijkstra Shortest Path', () => {
    test('finds optimal path from London to Berlin via Brussels and Amsterdam', () => {
      const result = dijkstra(nodes, edges, 'london', 'berlin');
      expect(result).not.toBeNull();
      expect(result.path[0]).toBe('london');
      expect(result.path[result.path.length - 1]).toBe('berlin');
      // London -> Brussels (120) -> Amsterdam (110) -> Berlin (360) = 590
      // London -> Paris (135) -> Berlin (500) = 635
      expect(result.totalWeight).toBe(590);
      expect(result.path).toEqual(['london', 'brussels', 'amsterdam', 'berlin']);
    });

    test('returns 0 weight when origin equals destination', () => {
      const result = dijkstra(nodes, edges, 'paris', 'paris');
      expect(result.totalWeight).toBe(0);
      expect(result.path).toEqual(['paris']);
    });

    test('returns null for unreachable nodes', () => {
      const result = dijkstra(nodes, edges, 'london', 'isolated');
      expect(result).toBeNull();
    });

    test('throws error when non-existent node is queried', () => {
      expect(() => dijkstra(nodes, edges, 'unknown', 'berlin')).toThrow();
    });
  });

  describe('A* Shortest Path with Spatial Heuristic', () => {
    test('finds shortest path directed by Haversine distance heuristic', () => {
      const result = aStar(nodes, edges, 'london', 'berlin');
      expect(result).not.toBeNull();
      expect(result.path).toEqual(['london', 'brussels', 'amsterdam', 'berlin']);
      expect(result.totalWeight).toBe(590);
    });

    test('returns null for unreachable nodes in A*', () => {
      const result = aStar(nodes, edges, 'london', 'isolated');
      expect(result).toBeNull();
    });
  });

  describe('Breadth-First Search (BFS)', () => {
    test('finds minimum hop route from London to Berlin', () => {
      const result = bfs(nodes, edges, 'london', 'berlin');
      expect(result.found).toBe(true);
      // London -> Paris -> Berlin is 2 hops (fewer hops than 3 hops via Brussels)
      expect(result.path.length).toBe(3);
      expect(result.path).toEqual(['london', 'paris', 'berlin']);
    });

    test('traverses full connected component when endId omitted', () => {
      const result = bfs(nodes, edges, 'london');
      expect(result.traversalOrder.length).toBe(5);
      expect(result.traversalOrder).not.toContain('isolated');
    });
  });

  describe('Depth-First Search (DFS)', () => {
    test('successfully finds a valid path between connected nodes', () => {
      const result = dfs(nodes, edges, 'london', 'amsterdam');
      expect(result.found).toBe(true);
      expect(result.path[0]).toBe('london');
      expect(result.path[result.path.length - 1]).toBe('amsterdam');
    });
  });

  describe("Minimum Spanning Tree (Kruskal's Algorithm)", () => {
    test('computes minimum weight tree covering connected nodes', () => {
      const connectedNodes = nodes.filter((n) => n.id !== 'isolated');
      const mst = minimumSpanningTree(connectedNodes, edges);

      expect(mst.algorithm).toBe('kruskal_mst');
      // For 5 connected nodes, tree must have 4 edges
      expect(mst.edges.length).toBe(4);
      // Selected edges:
      // Paris-Brussels (85)
      // Brussels-Amsterdam (110)
      // London-Brussels (120)
      // Amsterdam-Berlin (360)
      // Total = 85 + 110 + 120 + 360 = 675
      expect(mst.totalWeight).toBe(675);
    });
  });

  describe('Connected Components', () => {
    test('identifies separate subgraphs/partitions', () => {
      const result = findConnectedComponents(nodes, edges);
      expect(result.componentCount).toBe(2);
    });
  });
});
