import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import cytoscape from 'cytoscape';
import {
  Plus,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Trash2,
  MapPin,
  Info,
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

  // New Node Form
  const [nodeForm, setNodeForm] = useState({
    name: '',
    nodeType: 'destination',
    latitude: '',
    longitude: '',
    description: '',
  });

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
          selector: 'node:selected',
          style: {
            'border-width': 4,
            'border-color': '#00F0FF',
            'border-opacity': 1,
            'shadow-blur': 12,
            'shadow-color': '#00F0FF',
            'shadow-opacity': 0.8,
          },
        },
        {
          selector: 'edge:selected',
          style: {
            width: 4,
            'line-color': '#00F0FF',
            opacity: 1,
          },
        },
        {
          selector: '.highlighted',
          style: {
            'background-color': '#F59E0B',
            'border-color': '#FFFFFF',
            'border-width': 3,
            'shadow-blur': 16,
            'shadow-color': '#F59E0B',
            'shadow-opacity': 1,
            'z-index': 999,
          },
        },
        {
          selector: '.highlighted-edge',
          style: {
            width: 4,
            'line-color': '#F59E0B',
            opacity: 1,
            'z-index': 998,
          },
        },
      ],
      layout: {
        name: 'cose',
        idealEdgeLength: 100,
        nodeOverlap: 20,
        refresh: 20,
        fit: true,
        padding: 40,
        randomize: false,
        componentSpacing: 100,
        nodeRepulsion: 400000,
        edgeElasticity: 100,
        nestingFactor: 5,
        gravity: 80,
        numIter: 1000,
        initialTemp: 200,
        coolingFactor: 0.95,
        minTemp: 1.0,
      },
    });

    // Click events
    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      setSelectedNode(node.data('raw'));
      setSelectedEdge(null);
    });

    cy.on('tap', 'edge', (evt) => {
      const edge = evt.target;
      setSelectedEdge(edge.data('raw'));
      setSelectedNode(null);
    });

    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        setSelectedNode(null);
        setSelectedEdge(null);
      }
    });

    // Node drag position update
    cy.on('dragfree', 'node', async (evt) => {
      const node = evt.target;
      const pos = node.position();
      try {
        await api.put(`/graph/nodes/${node.id()}`, {
          positionX: pos.x,
          positionY: pos.y,
        });
      } catch (err) {
        console.error('Failed to save node position:', err);
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

        {/* Right Inspector Sidebar */}
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
    </DashboardLayout>
  );
};

export default GraphPage;
