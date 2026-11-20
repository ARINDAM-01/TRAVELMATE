import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  Globe,
  MapPin,
  Heart,
  Star,
  Filter,
  DollarSign,
  ArrowUpDown,
  Compass,
  AlertCircle,
  X,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Landmark,
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import api, { extractError } from '../services/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import Spinner from '../components/common/Spinner';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import { DESTINATION_CATEGORIES, INDIAN_STATES, POPULAR_INDIAN_DESTINATIONS, resolveDestinationImage } from '../utils/constants';

// Helper to strictly ensure only Indian destinations are shown
const isIndianDestination = (dest) => {
  if (!dest) return false;
  const name = (dest.name || '').toLowerCase().trim();
  const country = (dest.country || '').toLowerCase().trim();
  const city = (dest.city || '').toLowerCase().trim();
  
  const internationalTokens = [
    'paris', 'tokyo', 'rome', 'bali', 'barcelona', 'dubai', 'machu picchu',
    'new york', 'queenstown', 'santorini', 'london', 'amsterdam', 'singapore',
    'bangkok', 'sydney', 'los angeles', 'venice', 'florence', 'denpasar',
    'aguas calientes', 'fira'
  ];
  
  if (internationalTokens.some((t) => name.includes(t) || city.includes(t))) {
    return false;
  }
  if (country && !['india', 'ind', 'bharat', ''].includes(country)) {
    return false;
  }
  return true;
};

const POPULAR_STATES = [
  'Rajasthan',
  'Kerala',
  'Goa',
  'Himachal Pradesh',
  'Uttarakhand',
  'Jammu and Kashmir',
  'Ladakh',
  'Maharashtra',
  'Karnataka',
  'West Bengal',
  'Uttar Pradesh',
];

const Explore = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const stateParam = searchParams.get('state') || '';

  const [destinations, setDestinations] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedState, setSelectedState] = useState(stateParam);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Destination details modal
  const [selectedDest, setSelectedDest] = useState(null);
  const [destDetails, setDestDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchDestinations = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // If a specific Indian State is selected, use real-time state API
      if (selectedState) {
        const url = `/destinations/state/${encodeURIComponent(selectedState)}${forceRefresh ? '?refresh=true' : ''}`;
        const [destRes, favRes] = await Promise.all([
          api.get(url),
          api.get('/favorites').catch(() => ({ data: { data: { favorites: [] } } })),
        ]);

        let items = destRes.data?.data?.destinations || [];
        if (selectedCategory) {
          items = items.filter((d) => d.category === selectedCategory);
        }
        if (sortBy === 'budget') {
          items.sort((a, b) => (a.estimatedBudgetPerDay || 0) - (b.estimatedBudgetPerDay || 0));
        } else {
          items.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        }

        setDestinations(items);
        const favSet = new Set((favRes.data?.data?.favorites || []).map((f) => f.destinationId));
        setFavorites(favSet);
      } else {
        // All India exploration - strictly Indian destinations
        const params = { country: 'India' };
        if (searchQuery.trim()) params.search = searchQuery.trim();
        if (selectedCategory) params.category = selectedCategory;
        if (sortBy) params.sortBy = sortBy;

        const [destRes, favRes] = await Promise.all([
          api.get('/destinations', { params }).catch(() => ({ data: { data: [] } })),
          api.get('/favorites').catch(() => ({ data: { data: { favorites: [] } } })),
        ]);

        const rawList = destRes.data?.data || [];
        // Strictly filter out any international destinations
        let indianItems = rawList.filter(isIndianDestination);

        // Merge with curated top Indian destinations to guarantee a rich catalog
        const seenNames = new Set(indianItems.map((d) => d.name.toLowerCase()));
        const additionalIndian = POPULAR_INDIAN_DESTINATIONS.filter(
          (d) => !seenNames.has(d.name.toLowerCase())
        );
        let items = [...indianItems, ...additionalIndian];

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          items = items.filter(
            (d) =>
              (d.name && d.name.toLowerCase().includes(q)) ||
              (d.city && d.city.toLowerCase().includes(q)) ||
              (d.tags && d.tags.some((t) => t.toLowerCase().includes(q)))
          );
        }

        if (selectedCategory) {
          items = items.filter((d) => d.category === selectedCategory);
        }

        if (sortBy === 'budget') {
          items.sort((a, b) => (a.estimatedBudgetPerDay || 0) - (b.estimatedBudgetPerDay || 0));
        } else {
          items.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        }

        setDestinations(items);
        const favSet = new Set((favRes.data?.data?.favorites || []).map((f) => f.destinationId));
        setFavorites(favSet);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, [selectedState, selectedCategory, sortBy]);

  const handleStateChange = (stateName) => {
    setSelectedState(stateName);
    const newParams = {};
    if (searchQuery) newParams.q = searchQuery;
    if (stateName) newParams.state = stateName;
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDestinations();
    const newParams = {};
    if (searchQuery) newParams.q = searchQuery;
    if (selectedState) newParams.state = selectedState;
    setSearchParams(newParams);
  };

  const handleToggleFavorite = async (e, destId) => {
    e.stopPropagation();
    try {
      if (favorites.has(destId)) {
        const favRes = await api.get('/favorites');
        const fav = favRes.data.data.favorites.find((f) => f.destinationId === destId);
        if (fav) {
          await api.delete(`/favorites/${fav.id}`);
        }
        setFavorites((prev) => {
          const next = new Set(prev);
          next.delete(destId);
          return next;
        });
      } else {
        await api.post('/favorites', { destinationId: destId });
        setFavorites((prev) => new Set(prev).add(destId));
      }
    } catch (err) {
      alert(extractError(err));
    }
  };

  const handleOpenDestination = async (dest) => {
    setSelectedDest(dest);
    setDetailsLoading(true);
    try {
      if (dest.id) {
        const { data } = await api.get(`/destinations/${dest.id}`);
        setDestDetails(data.data.destination);
      } else {
        setDestDetails(dest);
      }
    } catch {
      setDestDetails(dest);
    } finally {
      setDetailsLoading(false);
    }
  };

  const currentStateInfo = INDIAN_STATES.find(
    (s) => s.name.toLowerCase() === selectedState.toLowerCase()
  );

  return (
    <DashboardLayout activeTitle="Incredible India Destination Explorer">
      {/* Header and Filter Controls */}
      <div className="glass-card p-6 border border-white/10 mb-8 space-y-5">
        {/* State Selection Bar */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin size={15} className="text-amber-400" />
              <span>Select Indian State or Union Territory:</span>
            </label>
            <span className="text-[11px] text-amber-400 flex items-center gap-1 font-semibold">
              <Sparkles size={13} /> Real-time Dynamic Travel Insights
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 relative">
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full bg-[#161B26] border border-white/10 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-amber-400/50 transition-all"
              >
                <option value="" className="bg-[#13161F] text-white">
                  🇮🇳 All India (Explore Across States)
                </option>
                {INDIAN_STATES.map((s) => (
                  <option key={s.code} value={s.name} className="bg-[#13161F] text-white">
                    {s.name} ({s.region} India) - Capital: {s.capital}
                  </option>
                ))}
              </select>
            </div>

            {selectedState && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="md"
                  className="flex-1 text-xs"
                  disabled={refreshing || loading}
                  onClick={() => fetchDestinations(true)}
                >
                  <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                  <span>{refreshing ? 'Generating...' : 'Refresh with AI'}</span>
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  className="flex-1 text-xs"
                  onClick={() => navigate(`/dashboard/planner?state=${encodeURIComponent(selectedState)}`)}
                >
                  <Sparkles size={14} />
                  <span>Plan AI Trip</span>
                </Button>
              </div>
            )}
          </div>

          {/* Quick-select popular states pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-3">
            <button
              onClick={() => handleStateChange('')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                selectedState === ''
                  ? 'bg-white text-neutral-950 font-bold shadow-sm'
                  : 'bg-white/5 text-neutral-400 hover:text-white'
              }`}
            >
              🇮🇳 All India
            </button>
            {POPULAR_STATES.map((state) => (
              <button
                key={state}
                onClick={() => handleStateChange(state)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                  selectedState === state
                    ? 'bg-white text-neutral-950 font-bold shadow-sm'
                    : 'bg-white/5 text-neutral-300 hover:text-white'
                }`}
              >
                {state}
              </button>
            ))}
          </div>
        </div>

        {/* Selected State Banner */}
        {currentStateInfo && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-electric-blue/10 via-electric-cyan/5 to-violet/10 border border-electric-cyan/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>{currentStateInfo.name}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/30">
                  {currentStateInfo.region} India
                </span>
              </h3>
              <p className="text-xs text-white/70 mt-0.5">
                <span className="font-semibold text-white/90">Capital:</span> {currentStateInfo.capital} • <span className="font-semibold text-white/90">Known for:</span> {currentStateInfo.famousFor}
              </p>
            </div>
            <span className="text-[11px] text-white/50 shrink-0">
              Showing top tourist hubs in {currentStateInfo.name}
            </span>
          </div>
        )}

        {/* Search bar and sorting */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2 border-t border-white/5">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder={selectedState ? `Search destinations in ${selectedState}...` : "Search city, state, or landmark in India (e.g. Jaipur, Munnar, Varanasi)..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-electric-blue transition-all"
              />
            </div>
            <Button type="submit" variant="primary" size="md">
              Search
            </Button>
          </form>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <ArrowUpDown size={14} className="text-white/40" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-electric-blue"
              >
                <option value="name" className="bg-navy-secondary text-white">Sort by Name</option>
                <option value="budget" className="bg-navy-secondary text-white">Sort by Budget (₹/day)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              selectedCategory === ''
                ? 'bg-electric-blue text-white shadow-md shadow-blue-500/25'
                : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            All Themes
          </button>
          {DESTINATION_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.value
                  ? 'bg-electric-blue text-white shadow-md shadow-blue-500/25'
                  : 'bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Destinations Grid */}
      {loading ? (
        <div className="space-y-4">
          {selectedState && (
            <div className="p-4 rounded-xl bg-electric-blue/10 border border-electric-blue/20 text-center text-sm text-electric-cyan font-medium animate-pulse flex items-center justify-center gap-2">
              <Spinner size="sm" />
              <span>Fetching real-time tourist destinations and attractions for {selectedState}...</span>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : destinations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => {
            const isFav = favorites.has(dest.id);
            return (
              <div
                key={dest.id || dest.name}
                onClick={() => handleOpenDestination(dest)}
                className="glass-card overflow-hidden group cursor-pointer border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Destination image header */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-tr from-navy to-navy-secondary">
                    <img
                      src={resolveDestinationImage(dest.name, dest.city, dest.category, dest.imageUrl)}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = resolveDestinationImage(dest.name, dest.city, dest.category);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent" />

                    {/* Favorite Button */}
                    {dest.id && (
                      <button
                        onClick={(e) => handleToggleFavorite(e, dest.id)}
                        className={`
                          absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all
                          ${
                            isFav
                              ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                              : 'bg-navy/70 text-white/60 hover:text-white hover:bg-navy'
                          }
                        `}
                        aria-label="Save favorite"
                      >
                        <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
                      </button>
                    )}

                    {/* Budget Badge */}
                    {dest.estimatedBudgetPerDay && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-navy/80 backdrop-blur-md text-amber border border-white/10">
                        ₹{dest.estimatedBudgetPerDay.toLocaleString('en-IN')}/day
                      </span>
                    )}

                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="text-xl font-black text-white truncate">{dest.name}</h3>
                      <p className="text-xs text-white/80 flex items-center gap-1 font-medium truncate">
                        <MapPin size={12} className="text-electric-cyan shrink-0" /> {dest.city ? `${dest.city}, India` : 'India'}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                      {dest.description || 'Stunning destination in India featuring rich sights.'}
                    </p>

                    {dest.tags && dest.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {dest.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 border border-white/5 text-white/60"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer stats */}
                <div className="px-5 py-3 border-t border-white/5 bg-white/[0.02] flex items-center justify-between text-xs text-white/40">
                  <span className="flex items-center gap-1.5">
                    <Compass size={13} className="text-electric-cyan" />
                    <span>{dest._count?.attractions || dest.attractions?.length || 3}+ Attractions</span>
                  </span>
                  <span className="text-electric-blue hover:text-electric-cyan font-bold flex items-center gap-1">
                    Explore Details &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title={`No destinations found for ${selectedState || 'this search'}`}
          description="Try selecting a different Indian state, clearing theme filters, or clicking 'Refresh with AI' to generate real-time attractions."
          actionText="View All India"
          onAction={() => {
            setSelectedState('');
            setSelectedCategory('');
            setSearchQuery('');
          }}
        />
      )}

      {/* Destination Details Modal */}
      <Modal
        isOpen={!!selectedDest}
        onClose={() => {
          setSelectedDest(null);
          setDestDetails(null);
        }}
        title={destDetails?.name || selectedDest?.name || 'Destination Details'}
        size="lg"
      >
        {detailsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : destDetails ? (
          <div className="space-y-6">
            {/* Modal Image banner */}
            <div className="relative h-60 rounded-2xl overflow-hidden bg-navy-secondary">
              <img
                src={resolveDestinationImage(destDetails.name, destDetails.city, destDetails.category, destDetails.imageUrl)}
                alt={destDetails.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = resolveDestinationImage(destDetails.name, destDetails.city, destDetails.category);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white">{destDetails.name}</h2>
                  <p className="text-sm text-electric-cyan font-semibold flex items-center gap-1">
                    <MapPin size={14} /> {destDetails.city ? `${destDetails.city}, India` : 'India'}
                  </p>
                </div>
                {destDetails.estimatedBudgetPerDay && (
                  <div className="bg-navy/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-right">
                    <span className="text-[10px] text-white/50 uppercase block font-bold">Daily Budget</span>
                    <span className="text-sm font-black text-amber">
                      ₹{destDetails.estimatedBudgetPerDay.toLocaleString('en-IN')}/day
                    </span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-white/80 leading-relaxed">{destDetails.description}</p>

            {/* Attractions Section */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <Landmark size={15} className="text-electric-cyan" />
                <span>Top Attractions & Landmarks</span>
              </h3>
              {destDetails.attractions && destDetails.attractions.length > 0 ? (
                <div className="space-y-3">
                  {destDetails.attractions.map((att) => (
                    <div
                      key={att.id || att.name}
                      className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{att.name}</h4>
                          {att.rating && (
                            <span className="flex items-center gap-1 text-[11px] text-amber font-bold">
                              <Star size={11} fill="currentColor" /> {att.rating}
                            </span>
                          )}
                        </div>
                        {att.description && (
                          <p className="text-xs text-white/60 leading-relaxed">{att.description}</p>
                        )}
                        <div className="flex items-center gap-3 text-[11px] text-white/40 pt-1">
                          {att.openingHours && <span>🕒 {att.openingHours}</span>}
                          {att.estimatedDurationHours && (
                            <span>⏱️ ~{att.estimatedDurationHours} hrs</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-electric-cyan block">
                          {att.estimatedCost === 0 ? 'Free Entry' : `₹${att.estimatedCost}`}
                        </span>
                        <span className="text-[10px] text-white/40 uppercase font-semibold">
                          {att.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-white/40 italic">No attractions listed yet.</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex gap-3">
              <Button
                variant="primary"
                size="md"
                className="flex-1"
                onClick={() => {
                  const placeName = destDetails.name;
                  const stateVal = destDetails.city || selectedState;
                  navigate(`/dashboard/planner?destination=${encodeURIComponent(placeName)}&state=${encodeURIComponent(stateVal)}`);
                }}
              >
                <Sparkles size={16} />
                <span>Generate AI Itinerary for {destDetails.name}</span>
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </DashboardLayout>
  );
};

export default Explore;
