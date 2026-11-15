import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import api, { extractError } from '../services/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import Spinner from '../components/common/Spinner';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import { DESTINATION_CATEGORIES } from '../utils/constants';

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [destinations, setDestinations] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Destination details modal
  const [selectedDest, setSelectedDest] = useState(null);
  const [destDetails, setDestDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedCategory) params.category = selectedCategory;
      if (sortBy) params.sortBy = sortBy;

      const [destRes, favRes] = await Promise.all([
        api.get('/destinations', { params }),
        api.get('/favorites').catch(() => ({ data: { data: { favorites: [] } } })),
      ]);

      setDestinations(destRes.data.data);

      const favSet = new Set((favRes.data.data.favorites || []).map((f) => f.destinationId));
      setFavorites(favSet);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, [selectedCategory, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDestinations();
    setSearchParams(searchQuery ? { q: searchQuery } : {});
  };

  const handleToggleFavorite = async (e, destId) => {
    e.stopPropagation();
    try {
      if (favorites.has(destId)) {
        // Find favorite ID
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
      const { data } = await api.get(`/destinations/${dest.id}`);
      setDestDetails(data.data.destination);
    } catch (err) {
      alert(extractError(err));
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <DashboardLayout activeTitle="Destination Explorer">
      {/* Header and Filter Controls */}
      <div className="glass-card p-6 border border-white/10 mb-8 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search by city, country, or landmark..."
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
                <option value="budget" className="bg-navy-secondary text-white">Sort by Daily Budget</option>
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
            All Categories
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : destinations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => {
            const isFav = favorites.has(dest.id);
            return (
              <div
                key={dest.id}
                onClick={() => handleOpenDestination(dest)}
                className="glass-card overflow-hidden group cursor-pointer border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Destination image header */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-tr from-navy to-navy-secondary">
                    {dest.imageUrl ? (
                      <img
                        src={dest.imageUrl}
                        alt={dest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-electric-blue/20 to-violet/20">
                        🌍
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent" />

                    {/* Favorite Button */}
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

                    {/* Budget Badge */}
                    {dest.estimatedBudgetPerDay && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-navy/80 backdrop-blur-md text-amber border border-white/10">
                        ~{dest.currency} {dest.estimatedBudgetPerDay}/day
                      </span>
                    )}

                    <div className="absolute bottom-3 left-4">
                      <h3 className="text-xl font-black text-white">{dest.name}</h3>
                      <p className="text-xs text-white/70 flex items-center gap-1 font-medium">
                        <MapPin size={12} className="text-electric-cyan" /> {dest.country}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                      {dest.description || 'Stunning destination featuring world-class sights.'}
                    </p>

                    {dest.tags && dest.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {dest.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 border border-white/5 text-white/60"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
                  <span>{dest._count?.attractions || 0} Attractions listed</span>
                  <span className="text-electric-cyan font-semibold group-hover:underline flex items-center gap-1">
                    Details →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card p-12 border border-white/10 text-center">
          <EmptyState
            icon={Compass}
            title="No Destinations Found"
            description="Try modifying your search query or switching category filters."
          />
        </div>
      )}

      {/* Destination Details Modal */}
      <Modal
        isOpen={Boolean(selectedDest)}
        onClose={() => {
          setSelectedDest(null);
          setDestDetails(null);
        }}
        size="lg"
        title={selectedDest?.name}
      >
        {detailsLoading ? (
          <div className="py-12 text-center">
            <Spinner size="md" className="mb-2" />
            <p className="text-xs text-white/50">Fetching attractions and details...</p>
          </div>
        ) : destDetails ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white/5 rounded-2xl">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider">Location</p>
                <p className="text-base font-bold text-white flex items-center gap-1.5">
                  <MapPin size={16} className="text-electric-cyan" />
                  {destDetails.name}, {destDetails.country}
                </p>
              </div>

              {destDetails.estimatedBudgetPerDay && (
                <div className="text-left sm:text-right">
                  <p className="text-xs text-white/40 uppercase tracking-wider">Estimated Budget</p>
                  <p className="text-base font-black text-amber">
                    ~{destDetails.currency} {destDetails.estimatedBudgetPerDay} / day
                  </p>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-2">About</h4>
              <p className="text-sm text-white/80 leading-relaxed font-normal">
                {destDetails.description}
              </p>
            </div>

            {/* Attractions Listing */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-3">
                Key Attractions & Sights ({destDetails.attractions?.length || 0})
              </h4>

              <div className="space-y-3">
                {destDetails.attractions?.map((attr) => (
                  <div
                    key={attr.id}
                    className="p-4 bg-navy border border-white/10 rounded-xl flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-sm">{attr.name}</span>
                        {attr.rating && (
                          <span className="text-xs text-amber font-bold flex items-center gap-1">
                            <Star size={12} fill="currentColor" /> {attr.rating}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/60 mb-2">{attr.description}</p>
                      {attr.openingHours && (
                        <p className="text-[11px] text-white/40">Hours: {attr.openingHours}</p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-amber">
                        {attr.estimatedCost > 0 ? `${attr.currency} ${attr.estimatedCost}` : 'Free'}
                      </span>
                      {attr.estimatedDurationHours && (
                        <span className="block text-[11px] text-white/40">
                          ~{attr.estimatedDurationHours}h duration
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </DashboardLayout>
  );
};

export default Explore;
