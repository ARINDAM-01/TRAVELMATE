import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Map as MapIcon,
  Route,
  Navigation,
  Compass,
  Clock,
  Car,
  Footprints,
  Layers,
  MapPin,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import api, { extractError } from '../services/api';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

// Fix Leaflet's default icon missing issue in React bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom colored SVG pin generator for Leaflet
const createPinIcon = (color = '#3B82F6') => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid #ffffff;
        box-shadow: 0 0 15px ${color}88;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background: #ffffff;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

// Component to dynamically pan and zoom the map to markers/route
const MapRecenter = ({ center, bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, bounds, map]);
  return null;
};

const Maps = () => {
  const [searchParams] = useSearchParams();
  const tripIdParam = searchParams.get('tripId');

  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(tripIdParam || '');
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Routing State
  const [routeOrigin, setRouteOrigin] = useState('');
  const [routeDest, setRouteDest] = useState('');
  const [transitMode, setTransitMode] = useState('driving');
  const [calculatingRoute, setCalculatingRoute] = useState(false);
  const [calculatedRoute, setCalculatedRoute] = useState(null);
  const [routeError, setRouteError] = useState('');

  // Default coordinate center (New Delhi, India)
  const defaultCenter = [28.6139, 77.2090];

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const { data } = await api.get('/trips');
        setTrips(data.data);
        if (!selectedTripId && data.data.length > 0) {
          setSelectedTripId(data.data[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadTrips();
  }, []);

  const fetchTripMapData = async (tripId) => {
    if (!tripId) return;
    setLoading(true);
    setCalculatedRoute(null);
    try {
      const { data } = await api.get(`/map/${tripId}`);
      setMapData(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTripId) {
      fetchTripMapData(selectedTripId);
    }
  }, [selectedTripId]);

  // Extract all markers with lat/lng
  const markers = [];
  if (mapData?.graphNodes) {
    mapData.graphNodes.forEach((node) => {
      if (node.latitude && node.longitude) {
        markers.push({
          id: node.id,
          name: node.name,
          type: node.nodeType,
          lat: node.latitude,
          lng: node.longitude,
          source: 'Graph Node',
          color: '#3B82F6',
        });
      }
    });
  }

  if (mapData?.itineraryDays) {
    mapData.itineraryDays.forEach((day) => {
      day.activities?.forEach((act) => {
        if (act.latitude && act.longitude) {
          markers.push({
            id: act.id,
            name: act.name,
            type: act.category || 'Activity',
            lat: act.latitude,
            lng: act.longitude,
            source: `Day ${day.dayNumber} Activity`,
            color: '#22D3EE',
          });
        }
      });
    });
  }

  // Calculate real route using backend OSRM endpoint
  const handleCalculateRealRoute = async (e) => {
    e.preventDefault();
    setRouteError('');
    if (!routeOrigin || !routeDest) {
      setRouteError('Please select both origin and destination markers.');
      return;
    }

    const startNode = markers.find((m) => m.id === routeOrigin);
    const endNode = markers.find((m) => m.id === routeDest);

    if (!startNode || !endNode) {
      setRouteError('Could not locate coordinates for chosen points.');
      return;
    }

    setCalculatingRoute(true);
    try {
      const { data } = await api.post('/map/route', {
        waypoints: [
          { latitude: startNode.lat, longitude: startNode.lng },
          { latitude: endNode.lat, longitude: endNode.lng },
        ],
        mode: transitMode,
      });

      setCalculatedRoute(data.data);
    } catch (err) {
      setRouteError(extractError(err));
    } finally {
      setCalculatingRoute(false);
    }
  };

  // Convert GeoJSON route geometry coordinates [lng, lat] to Leaflet [lat, lng]
  const polylineCoords =
    calculatedRoute?.geometry?.coordinates?.map(([lng, lat]) => [lat, lng]) || [];

  const mapBounds =
    polylineCoords.length > 0
      ? polylineCoords
      : markers.length > 0
      ? markers.map((m) => [m.lat, m.lng])
      : null;

  return (
    <DashboardLayout activeTitle="Geographic Routes & Maps">
      {/* Top Controller Bar */}
      <div className="glass-card p-4 border border-white/10 mb-6 flex flex-wrap items-center justify-between gap-4">
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

        <div className="flex items-center gap-2 text-xs text-white/60">
          <span className="w-2.5 h-2.5 rounded-full bg-electric-blue" />
          <span>Graph Node</span>
          <span className="w-2.5 h-2.5 rounded-full bg-electric-cyan ml-2" />
          <span>Itinerary Activity</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-8 h-[600px] bg-navy-secondary rounded-2xl overflow-hidden border border-white/10 relative shadow-2xl">
          {loading && (
            <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm z-20 flex items-center justify-center">
              <Spinner size="lg" />
            </div>
          )}

          <MapContainer
            center={markers.length > 0 ? [markers[0].lat, markers[0].lng] : defaultCenter}
            zoom={12}
            scrollWheelZoom={true}
            className="w-full h-full"
            style={{ background: '#07111F' }}
          >
            {/* OpenStreetMap Tile Layer */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapRecenter
              center={markers.length > 0 ? [markers[0].lat, markers[0].lng] : defaultCenter}
              bounds={mapBounds}
            />

            {/* Render Location Markers */}
            {markers.map((m) => (
              <Marker
                key={m.id}
                position={[m.lat, m.lng]}
                icon={createPinIcon(m.color)}
              >
                <Popup className="travelmate-popup">
                  <div className="p-1 text-navy">
                    <h4 className="font-bold text-sm text-gray-900">{m.name}</h4>
                    <p className="text-xs text-gray-600">{m.source}</p>
                    <p className="text-[11px] text-gray-500 font-mono mt-1">
                      {m.lat.toFixed(4)}, {m.lng.toFixed(4)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Render OSRM Polyline Route */}
            {polylineCoords.length > 0 && (
              <Polyline
                positions={polylineCoords}
                color="#22D3EE"
                weight={5}
                opacity={0.85}
              />
            )}
          </MapContainer>
        </div>

        {/* Right Route Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card p-6 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Route size={16} className="text-electric-cyan" />
              OSRM Real-World Route Engine
            </h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Calculate road distance, travel duration, and geometric paths between your mapped stops.
            </p>

            {routeError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
                {routeError}
              </div>
            )}

            <form onSubmit={handleCalculateRealRoute} className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold uppercase text-white/60">Origin Point</label>
                <select
                  value={routeOrigin}
                  onChange={(e) => setRouteOrigin(e.target.value)}
                  className="bg-navy border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-blue"
                  required
                >
                  <option value="">Select Origin Location...</option>
                  {markers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.source})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold uppercase text-white/60">Destination Point</label>
                <select
                  value={routeDest}
                  onChange={(e) => setRouteDest(e.target.value)}
                  className="bg-navy border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-blue"
                  required
                >
                  <option value="">Select Target Location...</option>
                  {markers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.source})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold uppercase text-white/60">Transit Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTransitMode('driving')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      transitMode === 'driving'
                        ? 'bg-electric-blue text-white'
                        : 'bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    <Car size={14} /> Driving
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransitMode('walking')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      transitMode === 'walking'
                        ? 'bg-electric-cyan text-navy font-bold'
                        : 'bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    <Footprints size={14} /> Walking
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="gradient"
                size="md"
                loading={calculatingRoute}
                fullWidth
                icon={Navigation}
              >
                Compute Real Route
              </Button>
            </form>
          </div>

          {/* Calculated Route Metric Card */}
          {calculatedRoute && (
            <div className="glass-card p-5 border border-electric-cyan/30 bg-electric-cyan/5 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-electric-cyan block">
                Calculated Route Metrics
              </span>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-navy/60 rounded-xl">
                  <span className="text-white/40 block text-[11px]">Road Distance</span>
                  <span className="text-lg font-black text-white">
                    {(calculatedRoute.distance / 1000).toFixed(2)} km
                  </span>
                </div>

                <div className="p-3 bg-navy/60 rounded-xl">
                  <span className="text-white/40 block text-[11px]">Travel Duration</span>
                  <span className="text-lg font-black text-white">
                    {Math.round(calculatedRoute.duration / 60)} mins
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-white/40 leading-relaxed italic">
                Data generated by OSRM routing engine using OpenStreetMap coordinates.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Maps;
