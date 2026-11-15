import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import cytoscape from 'cytoscape';
import {
  Network,
  Plus,
  Play,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Trash2,
  MapPin,
  Route,
  Info,
  Clock,
  Compass,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import api, { extractError } from '../services/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import Spinner from '../components/common/Spinner';
import { NODE_TYPES, EDGE_TYPES } from '../utils/constants';

const GraphPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tripIdParam = searchParams.get('tripId');

  const containerRef = useRef(null);
  const cyRef = useRef(null);

  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(tripIdParam || '');
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(false);

  // Inspector Panels
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);

  // Modals
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);
  const [isAddEdgeOpen, setIsAddEdgeOpen] = useState(false);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);

  // New Node Form
  const [nodeForm, setNodeForm] = useState({
    name: '',
    nodeType: 'destination',
    latitude: '',
    longitude: '',
    description: '',
  });

  // New Edge Form
  const [edgeForm, setEdgeForm] = useState({
    sourceId: '',
    targetId: '',
    edgeType: 'road',
    transportMode: 'Car / Road',
    duration: '',
    distance: '',
    estimatedCost: '',
  });

  // Pathfinding state
  const [routeState, setRouteState] = useState({
    startId: '',
    endId: '',
    algorithm: 'dijkstra',
  });
  const [routeResult, setRouteResult] = useState(null);
  const [calculatingRoute, setCalculatingRoute] = useState(false);

  // Load Trips
  useEffect(() => {
    const loadTrips = async () => {
      try {
        const { data } = await api.get('/trips');
        setTrips(data.data);
        if (!selectedTripId && data.data.length > 0) {
          setSelectedTripId(data.data[0].id);
          setSearchParams({ tripId: data.data[0].id });
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadTrips();
  }, []);

  // Fetch Graph Data
  const fetchGraphData = async (tripId) => {
    if (!tripId) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/graph/${tripId}`);
      setNodes(data.data.nodes);
      setEdges(data.data.edges);
      initCytoscape(data.data.nodes, data.data.edges);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTripId) {
      fetchGraphData(selectedTripId);
      setSearchParams({ tripId: selectedTripId });
    }
  }, [selectedTripId]);

  // Initialize Cytoscape.js
  const initCytoscape = (nodesData, edgesData) => {
    if (!containerRef.current) return;

    if (cyRef.current) {
      cyRef.current.destroy();
    }

    const elements = [
      ...nodesData.map((n) => ({
        data: {
          id: n.id,
          label: n.name,
          nodeType: n.nodeType,
          color: NODE_TYPES[n.nodeType]?.color || '#3B82F6',
          raw: n,
        },
        position:
          n.positionX != null && n.positionY != null
            ? { x: n.positionX, y: n.positionY }
            : undefined,
      })),
      ...edgesData.map((e) => ({
        data: {
          id: e.id,
          source: e.sourceId,
          target: e.targetId,
          label: e.transportMode || e.edgeType,
          color: EDGE_TYPES[e.edgeType]?.color || '#64748B',
          raw: e,
        },
      })),
    ];

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: 'node',
          style: {
            label: 'data(label)',
            color: '#FFFFFF',
            'font-size': '11px',
            'font-family': 'Inter, sans-serif',
            'font-weight': 600,
            'text-valign': 'bottom',
            'text-margin-y': 6,
            'background-color': 'data(color)',
            'border-width': 2,
            'border-color': '#FFFFFF',
            'border-opacity': 0.7,
            width: 32,
            height: 32,
            'text-background-color': '#07111F',
            'text-background-opacity': 0.8,
            'text-background-padding': 3,
            'text-background-shape': 'roundrectangle',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 2,
            'line-color': 'data(color)',
            'target-arrow-color': 'data(color)',
            'target-arrow-shape': 'none',
            'curve-style': 'bezier',
            opacity: 0.75,
            label: 'data(label)',
            'font-size': '9px',
            color: 'rgba(255, 255, 255, 0.6)',
            'text-rotation': 'autorotate',
            'text-margin-y': -8,
            'text-background-color': '#07111F',
            'text-background-opacity': 0.85,
            'text-background-padding': 2,
          },
        },
        {
          selector: '.highlighted',
          style: {
            'background-color': '#22D3EE',
            'line-color': '#22D3EE',
            'target-arrow-color': '#22D3EE',
            'border-color': '#22D3EE',
            'border-width': 4,
            width: 38,
            height: 38,
            'shadow-blur': 25,
            'shadow-color': '#22D3EE',
            'shadow-opacity': 0.8,
            opacity: 1,
            'z-index': 999,
          },
        },
        {
          selector: '.highlighted-edge',
          style: {
            'line-color': '#22D3EE',
            width: 4,
            opacity: 1,
            'z-index': 999,
          },
        },
      ],
      layout:
        nodesData.some((n) => n.positionX != null)
          ? { name: 'preset' }
          : {
              name: 'cose',
              animate: false,
              padding: 50,
              nodeRepulsion: 450000,
            },
    });

    // Node click handler
    cy.on('tap', 'node', (evt) => {
      const nodeData = evt.target.data('raw');
      setSelectedNode(nodeData);
      setSelectedEdge(null);
    });

    // Edge click handler
    cy.on('tap', 'edge', (evt) => {
      const edgeData = evt.target.data('raw');
      setSelectedEdge(edgeData);
      setSelectedNode(null);
    });

    // Background tap
    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        setSelectedNode(null);
        setSelectedEdge(null);
      }
    });

    // Save positions after drag
    cy.on('dragfree', 'node', async (evt) => {
      const node = evt.target;
      const pos = node.position();
      try {
        await api.put(`/graph/nodes/${node.id()}`, {
          positionX: pos.x,
          positionY: pos.y,
        });
      } catch (err) {
        console.error('Failed to persist node position:', err);
      }
    });

    cyRef.current = cy;
  };

  // Add Node Handler
  const handleAddNode = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...nodeForm,
        tripId: selectedTripId,
        latitude: nodeForm.latitude ? parseFloat(nodeForm.latitude) : null,
        longitude: nodeForm.longitude ? parseFloat(nodeForm.longitude) : null,
        positionX: 300 + Math.random() * 100,
        positionY: 200 + Math.random() * 100,
      };

      await api.post('/graph/nodes', payload);
      setIsAddNodeOpen(false);
      setNodeForm({
        name: '',
        nodeType: 'destination',
        latitude: '',
        longitude: '',
        description: '',
      });
      fetchGraphData(selectedTripId);
    } catch (err) {
      alert(extractError(err));
    }
  };

  // Add Edge Handler
  const handleAddEdge = async (e) => {
    e.preventDefault();
    if (!edgeForm.sourceId || !edgeForm.targetId) {
      alert('Please select both source and target nodes');
      return;
    }
    try {
      const payload = {
        ...edgeForm,
        tripId: selectedTripId,
        distance: edgeForm.distance ? parseFloat(edgeForm.distance) : null,
        duration: edgeForm.duration ? parseFloat(edgeForm.duration) : null,
        estimatedCost: edgeForm.estimatedCost ? parseFloat(edgeForm.estimatedCost) : null,
      };

      await api.post('/graph/edges', payload);
      setIsAddEdgeOpen(false);
      fetchGraphData(selectedTripId);
    } catch (err) {
      alert(extractError(err));
    }
  };

  // Delete Node
  const handleDeleteNode = async (nodeId) => {
    if (!window.confirm('Delete this node and all connecting edges?')) return;
    try {
      await api.delete(`/graph/nodes/${nodeId}`);
      setSelectedNode(null);
      fetchGraphData(selectedTripId);
    } catch (err) {
      alert(extractError(err));
    }
  };

  // Delete Edge
  const handleDeleteEdge = async (edgeId) => {
    if (!window.confirm('Delete this edge connection?')) return;
    try {
      await api.delete(`/graph/edges/${edgeId}`);
      setSelectedEdge(null);
      fetchGraphData(selectedTripId);
    } catch (err) {
      alert(extractError(err));
    }
  };

  // Calculate Shortest Path
  const handleCalculateRoute = async (e) => {
    e.preventDefault();
    if (!routeState.startId || !routeState.endId) {
      alert('Please select starting and ending nodes');
      return;
    }

    setCalculatingRoute(true);
    setRouteResult(null);

    try {
      const { data } = await api.post('/graph/shortest-path', {
        tripId: selectedTripId,
        startId: routeState.startId,
        endId: routeState.endId,
        algorithm: routeState.algorithm,
      });

      const res = data.data.result;
      setRouteResult(res);

      // Highlight in Cytoscape
      if (cyRef.current && res.path) {
        cyRef.current.elements().removeClass('highlighted highlighted-edge');

        res.path.forEach((nodeId) => {
          cyRef.current.$(`#${nodeId}`).addClass('highlighted');
        });

        if (res.pathEdges) {
          res.pathEdges.forEach((edge) => {
            cyRef.current.$(`#${edge.id}`).addClass('highlighted-edge');
          });
        }
      }
    } catch (err) {
      alert(extractError(err));
    } finally {
      setCalculatingRoute(false);
    }
  };

  // Calculate Minimum Spanning Tree
  const handleCalculateMST = async () => {
    if (!selectedTripId) return;
    try {
      const { data } = await api.get(`/graph/${selectedTripId}/mst`);
      const mst = data.data;

      if (cyRef.current && mst.edges) {
        cyRef.current.elements().removeClass('highlighted highlighted-edge');

        mst.edges.forEach((e) => {
          cyRef.current.$(`#${e.id}`).addClass('highlighted-edge');
          cyRef.current.$(`#${e.sourceId}`).addClass('highlighted');
          cyRef.current.$(`#${e.targetId}`).addClass('highlighted');
        });

        alert(`Minimum Spanning Tree calculated!\nTotal Network Weight: ${mst.totalWeight}\nCovering ${mst.nodeCount} destinations with ${mst.edgeCount} edges.`);
      }
    } catch (err) {
      alert(extractError(err));
    }
  };

  const resetGraphLayout = () => {
    if (cyRef.current) {
      cyRef.current.elements().removeClass('highlighted highlighted-edge');
      cyRef.current.layout({ name: 'cose', animate: true }).run();
    }
  };

  return (
    <DashboardLayout activeTitle="Interactive Travel Graph">
      {/* Top Controls Bar */}
      <div className="glass-card p-4 border border-white/10 mb-6 flex flex-wrap items-center justify-between gap-4">
        {/* Trip Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-white/50">Trip:</label>
          <select
            value={selectedTripId}
            onChange={(e) => setSelectedTripId(e.target.value)}
            className="bg-navy-secondary border border-white/15 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-electric-blue"
          >
            {trips.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Plus}
            onClick={() => setIsAddNodeOpen(true)}
          >
            Add Node
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={Route}
            onClick={() => setIsAddEdgeOpen(true)}
          >
            Connect Nodes
          </Button>
          <Button
            variant="gradient"
            size="sm"
            icon={Play}
            onClick={() => setIsRouteModalOpen(true)}
          >
            Pathfinding
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={Network}
            onClick={handleCalculateMST}
          >
            MST Network
          </Button>
          <button
            onClick={resetGraphLayout}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-colors"
            title="Reset Layout"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={() => cyRef.current?.zoom(cyRef.current.zoom() * 1.2)}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={() => cyRef.current?.zoom(cyRef.current.zoom() * 0.8)}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <Link to={`/dashboard/maps?tripId=${selectedTripId}`}>
            <button
              className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-electric-cyan flex items-center gap-1.5 transition-colors"
              title="View on Map"
            >
              <MapPin size={14} /> Map View
            </button>
          </Link>
        </div>
      </div>

      {/* Main Canvas Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        {/* Cytoscape Container */}
        <div className="lg:col-span-9 h-[620px] bg-navy-secondary/80 border border-white/10 rounded-2xl relative overflow-hidden shadow-2xl">
          {loading && (
            <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm z-20 flex items-center justify-center">
              <Spinner size="lg" />
            </div>
          )}

          {/* Cytoscape DOM Mount */}
          <div ref={containerRef} className="w-full h-full" />

          {/* Canvas Overlay Legend */}
          <div className="absolute bottom-4 left-4 p-3 bg-navy/90 backdrop-blur-md border border-white/10 rounded-xl flex flex-wrap gap-3 text-[11px] text-white/60 pointer-events-none z-10">
            {Object.entries(NODE_TYPES).slice(0, 5).map(([type, meta]) => (
              <span key={type} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.color }} />
                <span>{meta.label}</span>
              </span>
            ))}
          </div>

          <div className="absolute top-4 right-4 text-[10px] text-white/40 font-mono bg-navy/70 px-2 py-1 rounded border border-white/5">
            DRAG NODES TO POSITION · CLICK TO INSPECT
          </div>
        </div>

        {/* Right Inspector & Algorithm Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          {/* Node Inspector */}
          {selectedNode ? (
            <div className="glass-card p-5 border border-white/10 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-electric-cyan">
                    Node Inspector
                  </span>
                  <h4 className="text-base font-black text-white">{selectedNode.name}</h4>
                  <p className="text-xs text-white/50 capitalize">{selectedNode.nodeType}</p>
                </div>
                <button
                  onClick={() => handleDeleteNode(selectedNode.id)}
                  className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete Node"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {selectedNode.description && (
                <p className="text-xs text-white/70 leading-relaxed">{selectedNode.description}</p>
              )}

              {selectedNode.latitude != null && (
                <div className="text-[11px] text-white/40 space-y-0.5">
                  <p>Lat: {selectedNode.latitude.toFixed(4)}</p>
                  <p>Lng: {selectedNode.longitude.toFixed(4)}</p>
                </div>
              )}

              <div className="pt-2 border-t border-white/10 flex gap-2">
                <button
                  onClick={() => {
                    setRouteState((prev) => ({ ...prev, startId: selectedNode.id }));
                    setIsRouteModalOpen(true);
                  }}
                  className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-white/80 transition-colors"
                >
                  Route From
                </button>
                <button
                  onClick={() => {
                    setRouteState((prev) => ({ ...prev, endId: selectedNode.id }));
                    setIsRouteModalOpen(true);
                  }}
                  className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-white/80 transition-colors"
                >
                  Route To
                </button>
              </div>
            </div>
          ) : selectedEdge ? (
            <div className="glass-card p-5 border border-white/10 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet">
                    Edge Inspector
                  </span>
                  <h4 className="text-sm font-bold text-white capitalize">{selectedEdge.edgeType}</h4>
                  <p className="text-xs text-white/50">{selectedEdge.transportMode || 'Connection'}</p>
                </div>
                <button
                  onClick={() => handleDeleteEdge(selectedEdge.id)}
                  className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete Edge"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                {selectedEdge.distance != null && (
                  <div className="flex justify-between text-white/70">
                    <span className="text-white/40">Distance:</span>
                    <span>{selectedEdge.distance} km</span>
                  </div>
                )}
                {selectedEdge.duration != null && (
                  <div className="flex justify-between text-white/70">
                    <span className="text-white/40">Duration:</span>
                    <span>{selectedEdge.duration} mins</span>
                  </div>
                )}
                {selectedEdge.estimatedCost != null && (
                  <div className="flex justify-between text-white/70">
                    <span className="text-white/40">Est. Cost:</span>
                    <span>
                      {selectedEdge.currency} {selectedEdge.estimatedCost}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-card p-6 border border-white/10 text-center">
              <Info size={28} className="text-white/30 mx-auto mb-2" />
              <p className="text-xs text-white/50">
                Click any node or edge on the canvas to inspect coordinates and properties.
              </p>
            </div>
          )}

          {/* Route Result Preview Card */}
          {routeResult && (
            <div className="glass-card p-5 border border-electric-cyan/30 bg-electric-cyan/5 space-y-3">
              <div className="flex items-center gap-2 text-electric-cyan">
                <Sparkles size={16} />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  Optimal Path Found ({routeResult.algorithm})
                </h4>
              </div>
              <p className="text-xs text-white/80 font-mono">
                {routeResult.path?.join(' → ')}
              </p>
              <div className="text-xs text-white/60">
                Total Path Weight: <span className="font-bold text-white">{routeResult.totalWeight}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= ADD NODE MODAL ================= */}
      <Modal
        isOpen={isAddNodeOpen}
        onClose={() => setIsAddNodeOpen(false)}
        title="Add Graph Node"
      >
        <form onSubmit={handleAddNode} className="space-y-4">
          <Input
            label="Location Name"
            placeholder="e.g. Louvre Museum"
            value={nodeForm.name}
            onChange={(e) => setNodeForm({ ...nodeForm, name: e.target.value })}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase text-white/70">Node Type</label>
            <select
              value={nodeForm.nodeType}
              onChange={(e) => setNodeForm({ ...nodeForm, nodeType: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-blue"
            >
              {Object.entries(NODE_TYPES).map(([type, meta]) => (
                <option key={type} value={type} className="bg-navy-secondary text-white">
                  {meta.icon} {meta.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Latitude"
              type="number"
              step="any"
              placeholder="48.8606"
              value={nodeForm.latitude}
              onChange={(e) => setNodeForm({ ...nodeForm, latitude: e.target.value })}
            />
            <Input
              label="Longitude"
              type="number"
              step="any"
              placeholder="2.3376"
              value={nodeForm.longitude}
              onChange={(e) => setNodeForm({ ...nodeForm, longitude: e.target.value })}
            />
          </div>

          <Input
            label="Description"
            placeholder="Details or historical note..."
            value={nodeForm.description}
            onChange={(e) => setNodeForm({ ...nodeForm, description: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="outline" size="md" onClick={() => setIsAddNodeOpen(false)}>
              Cancel
            </Button>
            <Button variant="gradient" size="md" type="submit">
              Create Node
            </Button>
          </div>
        </form>
      </Modal>

      {/* ================= ADD EDGE MODAL ================= */}
      <Modal
        isOpen={isAddEdgeOpen}
        onClose={() => setIsAddEdgeOpen(false)}
        title="Connect Graph Nodes (Create Edge)"
      >
        <form onSubmit={handleAddEdge} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase text-white/70">Source Node</label>
              <select
                value={edgeForm.sourceId}
                onChange={(e) => setEdgeForm({ ...edgeForm, sourceId: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-blue"
                required
              >
                <option value="">Select Origin...</option>
                {nodes.map((n) => (
                  <option key={n.id} value={n.id} className="bg-navy-secondary text-white">
                    {n.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase text-white/70">Target Node</label>
              <select
                value={edgeForm.targetId}
                onChange={(e) => setEdgeForm({ ...edgeForm, targetId: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-blue"
                required
              >
                <option value="">Select Destination...</option>
                {nodes.map((n) => (
                  <option key={n.id} value={n.id} className="bg-navy-secondary text-white">
                    {n.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase text-white/70">Edge Connection Type</label>
              <select
                value={edgeForm.edgeType}
                onChange={(e) => setEdgeForm({ ...edgeForm, edgeType: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-blue"
              >
                {Object.entries(EDGE_TYPES).map(([type, meta]) => (
                  <option key={type} value={type} className="bg-navy-secondary text-white">
                    {meta.label}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Transit Mode"
              placeholder="e.g. Walking, Metro Line 1"
              value={edgeForm.transportMode}
              onChange={(e) => setEdgeForm({ ...edgeForm, transportMode: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Distance (km)"
              type="number"
              step="any"
              placeholder="3.5"
              value={edgeForm.distance}
              onChange={(e) => setEdgeForm({ ...edgeForm, distance: e.target.value })}
            />
            <Input
              label="Duration (mins)"
              type="number"
              step="any"
              placeholder="25"
              value={edgeForm.duration}
              onChange={(e) => setEdgeForm({ ...edgeForm, duration: e.target.value })}
            />
            <Input
              label="Est. Cost"
              type="number"
              step="any"
              placeholder="5.00"
              value={edgeForm.estimatedCost}
              onChange={(e) => setEdgeForm({ ...edgeForm, estimatedCost: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="outline" size="md" onClick={() => setIsAddEdgeOpen(false)}>
              Cancel
            </Button>
            <Button variant="gradient" size="md" type="submit">
              Connect Edge
            </Button>
          </div>
        </form>
      </Modal>

      {/* ================= PATHFINDING MODAL ================= */}
      <Modal
        isOpen={isRouteModalOpen}
        onClose={() => setIsRouteModalOpen(false)}
        title="Pathfinding & Route Optimization"
      >
        <form onSubmit={handleCalculateRoute} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase text-white/70">Origin Node</label>
              <select
                value={routeState.startId}
                onChange={(e) => setRouteState({ ...routeState, startId: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-blue"
                required
              >
                <option value="">Select Origin...</option>
                {nodes.map((n) => (
                  <option key={n.id} value={n.id} className="bg-navy-secondary text-white">
                    {n.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase text-white/70">Destination Node</label>
              <select
                value={routeState.endId}
                onChange={(e) => setRouteState({ ...routeState, endId: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-blue"
                required
              >
                <option value="">Select Target...</option>
                {nodes.map((n) => (
                  <option key={n.id} value={n.id} className="bg-navy-secondary text-white">
                    {n.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase text-white/70">Graph Algorithm</label>
            <select
              value={routeState.algorithm}
              onChange={(e) => setRouteState({ ...routeState, algorithm: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-blue"
            >
              <option value="dijkstra" className="bg-navy-secondary text-white">
                Dijkstra (Shortest weighted path - duration/distance)
              </option>
              <option value="astar" className="bg-navy-secondary text-white">
                A* (Spatial heuristic using Haversine distance)
              </option>
              <option value="bfs" className="bg-navy-secondary text-white">
                BFS (Minimum transfer hops)
              </option>
              <option value="dfs" className="bg-navy-secondary text-white">
                DFS (Depth-first traversal)
              </option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="outline" size="md" onClick={() => setIsRouteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="gradient"
              size="md"
              type="submit"
              loading={calculatingRoute}
              icon={Play}
            >
              Compute & Highlight
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default GraphPage;
