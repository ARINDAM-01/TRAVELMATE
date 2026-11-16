import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Plus,
  Trash2,
  Copy,
  Share2,
  Edit2,
  Sparkles,
  Network,
  Clock,
  CheckCircle,
  Circle,
  ExternalLink,
  AlertCircle,
  X,
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import api, { extractError } from '../services/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import { TRAVEL_STYLES, CURRENCY_LIST } from '../utils/constants';

const Trips = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTripId = searchParams.get('id');

  const [trips, setTrips] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [shareLoading, setShareLoading] = useState(false);

  // Create form state
  const [formData, setFormData] = useState({
    title: '',
    startLocation: '',
    destinations: '',
    startDate: '',
    endDate: '',
    numTravelers: 1,
    budget: '',
    currency: 'INR',
    travelStyle: 'cultural',
    description: '',
  });

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/trips');
      setTrips(data.data);

      if (selectedTripId) {
        fetchTripDetails(selectedTripId);
      } else if (data.data.length > 0) {
        fetchTripDetails(data.data[0].id);
      }
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchTripDetails = async (id) => {
    try {
      setDetailsLoading(true);
      const { data } = await api.get(`/trips/${id}`);
      setActiveTrip(data.data.trip);
      setSearchParams({ id });
    } catch (err) {
      setError(extractError(err));
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        destinations: formData.destinations
          .split(',')
          .map((d) => d.trim())
          .filter(Boolean),
        budget: formData.budget ? parseFloat(formData.budget) : null,
        numTravelers: parseInt(formData.numTravelers) || 1,
      };

      const { data } = await api.post('/trips', payload);
      setIsCreateModalOpen(false);
      setFormData({
        title: '',
        startLocation: '',
        destinations: '',
        startDate: '',
        endDate: '',
        numTravelers: 1,
        budget: '',
        currency: 'INR',
        travelStyle: 'cultural',
        description: '',
      });
      await fetchTrips();
      fetchTripDetails(data.data.trip.id);
    } catch (err) {
      alert(extractError(err));
    }
  };

  const handleDeleteTrip = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trip and all associated itinerary data?')) {
      return;
    }
    try {
      await api.delete(`/trips/${id}`);
      setActiveTrip(null);
      await fetchTrips();
    } catch (err) {
      alert(extractError(err));
    }
  };

  const handleDuplicateTrip = async (id) => {
    try {
      const { data } = await api.post(`/trips/${id}/duplicate`);
      await fetchTrips();
      fetchTripDetails(data.data.trip.id);
    } catch (err) {
      alert(extractError(err));
    }
  };

  const handleOpenShare = async (id) => {
    setIsShareModalOpen(true);
    setShareLoading(true);
    try {
      const { data } = await api.post(`/shared/trips/${id}/share`, {
        isPublic: true,
        expiresInDays: 30,
      });
      setShareData(data.data);
    } catch (err) {
      alert(extractError(err));
    } finally {
      setShareLoading(false);
    }
  };

  return (
    <DashboardLayout activeTitle="My Trips">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Trips & Itineraries</h2>
          <p className="text-xs text-white/50">Manage your active plans, days, and activities</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard/planner">
            <Button variant="gradient" size="sm" icon={Sparkles}>
              AI Planner
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            icon={Plus}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Trip
          </Button>
        </div>
      </div>

      {/* Main split view: Trip sidebar list + Active trip details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Trips List */}
        <div className="lg:col-span-4 space-y-3">
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="md" />
            </div>
          ) : trips.length > 0 ? (
            trips.map((trip) => {
              const isSelected = activeTrip?.id === trip.id;
              return (
                <div
                  key={trip.id}
                  onClick={() => fetchTripDetails(trip.id)}
                  className={`
                    p-4 rounded-2xl cursor-pointer transition-all border
                    ${
                      isSelected
                        ? 'bg-electric-blue/15 border-electric-blue/50 shadow-lg shadow-blue-500/10'
                        : 'glass-card border-white/10 hover:border-white/20'
                    }
                  `}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <h3 className="font-bold text-sm text-white truncate max-w-[200px]">
                      {trip.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/10 text-white/70">
                      {trip.status}
                    </span>
                  </div>

                  <p className="text-xs text-white/50 flex items-center gap-1 mb-2 truncate">
                    <MapPin size={12} className="text-electric-cyan shrink-0" />
                    {Array.isArray(trip.destinations) && trip.destinations.length > 0
                      ? trip.destinations.join(', ')
                      : trip.startLocation}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-white/40 pt-2 border-t border-white/5">
                    <span>{trip._count?.itineraryDays || 0} Days</span>
                    <span>{trip.budget ? `${trip.currency} ${trip.budget}` : 'No Budget Set'}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="glass-card p-6 text-center border border-white/10">
              <EmptyState
                title="No Trips Found"
                description="Create a manual trip or let AI generate one for you."
                action={() => setIsCreateModalOpen(true)}
                actionLabel="Create Trip"
              />
            </div>
          )}
        </div>

        {/* Right Column: Active Trip Detailed View */}
        <div className="lg:col-span-8">
          {detailsLoading ? (
            <div className="glass-card p-12 text-center border border-white/10 flex flex-col items-center justify-center">
              <Spinner size="lg" className="mb-4" />
              <p className="text-white/50 text-sm">Loading itinerary details...</p>
            </div>
          ) : activeTrip ? (
            <div className="glass-card p-6 sm:p-8 border border-white/10 space-y-6">
              {/* Trip Header Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-black text-white">{activeTrip.title}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/30">
                      {activeTrip.status}
                    </span>
                  </div>
                  <p className="text-sm text-white/60">{activeTrip.description || 'No description provided.'}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link to={`/dashboard/graph?tripId=${activeTrip.id}`}>
                    <Button variant="secondary" size="sm" icon={Network}>
                      Graph
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Share2}
                    onClick={() => handleOpenShare(activeTrip.id)}
                  >
                    Share
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Copy}
                    onClick={() => handleDuplicateTrip(activeTrip.id)}
                  >
                    Duplicate
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={Trash2}
                    onClick={() => handleDeleteTrip(activeTrip.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>

              {/* Trip Key Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-white/5 rounded-xl border border-white/5 text-xs">
                <div>
                  <span className="text-white/40 block mb-0.5">Start Location</span>
                  <span className="font-semibold text-white">{activeTrip.startLocation}</span>
                </div>
                <div>
                  <span className="text-white/40 block mb-0.5">Destinations</span>
                  <span className="font-semibold text-white">
                    {Array.isArray(activeTrip.destinations) ? activeTrip.destinations.join(', ') : '-'}
                  </span>
                </div>
                <div>
                  <span className="text-white/40 block mb-0.5">Travelers</span>
                  <span className="font-semibold text-white">{activeTrip.numTravelers} Person(s)</span>
                </div>
                <div>
                  <span className="text-white/40 block mb-0.5">Target Budget</span>
                  <span className="font-semibold text-amber">
                    {activeTrip.budget ? `${activeTrip.currency} ${activeTrip.budget}` : 'Flexible'}
                  </span>
                </div>
              </div>

              {/* Itinerary Days & Activities List */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar size={18} className="text-electric-cyan" />
                  Day-by-Day Itinerary ({activeTrip.itineraryDays?.length || 0} Days)
                </h3>

                {activeTrip.itineraryDays && activeTrip.itineraryDays.length > 0 ? (
                  activeTrip.itineraryDays.map((day) => (
                    <div
                      key={day.id}
                      className="p-5 bg-navy border border-white/10 rounded-2xl space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-electric-blue/20 text-electric-blue flex items-center justify-center font-bold text-sm">
                            {day.dayNumber}
                          </span>
                          <div>
                            <h4 className="font-bold text-white text-base">
                              Day {day.dayNumber}: {day.location || 'Excursion'}
                            </h4>
                            {day.summary && <p className="text-xs text-white/50">{day.summary}</p>}
                          </div>
                        </div>
                        {day.weatherNote && (
                          <span className="text-xs text-white/40 italic">🌦️ {day.weatherNote}</span>
                        )}
                      </div>

                      {/* Activities */}
                      <div className="space-y-2.5 pl-4 border-l border-white/10">
                        {day.activities && day.activities.length > 0 ? (
                          day.activities.map((act) => (
                            <div
                              key={act.id}
                              className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-start justify-between gap-3 text-xs"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-white text-sm">{act.name}</span>
                                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-white/10 text-white/60">
                                    {act.timeOfDay}
                                  </span>
                                </div>
                                {act.description && (
                                  <p className="text-white/60 leading-relaxed">{act.description}</p>
                                )}
                                {act.notes && (
                                  <p className="text-white/40 italic">Tip: {act.notes}</p>
                                )}
                              </div>
                              {act.estimatedCost > 0 && (
                                <span className="font-semibold text-amber shrink-0">
                                  ~{act.currency} {act.estimatedCost}
                                </span>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-white/40 italic py-2">
                            No activities scheduled for this day yet.
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-sm text-white/60 mb-3">No itinerary days have been configured for this trip.</p>
                    <Link to="/dashboard/planner">
                      <Button variant="gradient" size="sm" icon={Sparkles}>
                        Generate with AI
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 text-center border border-white/10">
              <EmptyState
                icon={MapPin}
                title="Select a Trip"
                description="Select an existing trip from the left sidebar or create a new expedition."
              />
            </div>
          )}
        </div>
      </div>

      {/* ================= CREATE TRIP MODAL ================= */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Trip"
      >
        <form onSubmit={handleCreateTrip} className="space-y-4">
          <Input
            label="Trip Title"
            placeholder="e.g. Japanese Cherry Blossom Tour"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Starting Location"
              placeholder="e.g. London, UK"
              value={formData.startLocation}
              onChange={(e) => setFormData({ ...formData, startLocation: e.target.value })}
              required
            />
            <Input
              label="Destinations (comma-separated)"
              placeholder="Jaipur, Jodhpur, Udaipur"
              value={formData.destinations}
              onChange={(e) => setFormData({ ...formData, destinations: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <Input
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Travelers"
              type="number"
              min="1"
              value={formData.numTravelers}
              onChange={(e) => setFormData({ ...formData, numTravelers: e.target.value })}
            />
            <Input
              label="Budget Limit"
              type="number"
              placeholder="e.g. 2500"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase text-white/70">Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-blue"
              >
                {CURRENCY_LIST.map((c) => (
                  <option key={c.code} value={c.code} className="bg-navy-secondary text-white">
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase text-white/70">Travel Style</label>
            <select
              value={formData.travelStyle}
              onChange={(e) => setFormData({ ...formData, travelStyle: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-blue"
            >
              {TRAVEL_STYLES.map((s) => (
                <option key={s.value} value={s.value} className="bg-navy-secondary text-white">
                  {s.icon} {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase text-white/70">Description / Notes</label>
            <textarea
              rows="3"
              placeholder="What are the goals or highlights of this trip?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-electric-blue"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="outline" size="md" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gradient" size="md" type="submit">
              Save Trip
            </Button>
          </div>
        </form>
      </Modal>

      {/* ================= SHARE TRIP MODAL ================= */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share Your Trip"
      >
        {shareLoading ? (
          <div className="py-8 text-center">
            <Spinner size="md" className="mb-2" />
            <p className="text-xs text-white/50">Generating secure share token...</p>
          </div>
        ) : shareData ? (
          <div className="space-y-4">
            <p className="text-sm text-white/70">
              Anyone with this link can view your itinerary, destinations, and travel graph in read-only mode:
            </p>
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between gap-3">
              <span className="text-xs text-electric-cyan font-mono truncate">{shareData.shareUrl}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareData.shareUrl);
                  alert('Share URL copied to clipboard!');
                }}
                className="px-3 py-1 bg-electric-blue hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-colors shrink-0"
              >
                Copy
              </button>
            </div>
            <div className="text-xs text-white/40">
              Access level: Public Read-Only · Permissions enforced on backend
            </div>
          </div>
        ) : null}
      </Modal>
    </DashboardLayout>
  );
};

export default Trips;
