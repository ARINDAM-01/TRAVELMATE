import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Trash2, Globe, ArrowRight, Compass } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import api, { extractError } from '../services/api';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import { resolveDestinationImage } from '../utils/constants';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/favorites');
      setFavorites(data.data.favorites);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (id) => {
    try {
      await api.delete(`/favorites/${id}`);
      setFavorites((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      alert(extractError(err));
    }
  };

  return (
    <DashboardLayout activeTitle="Saved Destinations">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Your Bookmarked Escapes</h2>
        <p className="text-xs text-white/50">Quickly access and incorporate favorite places into your upcoming itineraries</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => {
            const dest = fav.destination;
            return (
              <div
                key={fav.id}
                className="glass-card overflow-hidden border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-gradient-to-tr from-navy to-navy-secondary">
                    <img
                      src={resolveDestinationImage(dest?.name, dest?.city, dest?.category, dest?.imageUrl)}
                      alt={dest?.name || 'Destination'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = resolveDestinationImage(dest?.name, dest?.city, dest?.category);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />

                    <button
                      onClick={() => handleRemoveFavorite(fav.id)}
                      className="absolute top-3 right-3 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-xl backdrop-blur-md transition-all shadow-lg"
                      title="Remove from favorites"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="absolute bottom-3 left-4">
                      <h3 className="text-xl font-black text-white">{dest.name}</h3>
                      <p className="text-xs text-white/70 flex items-center gap-1 font-medium">
                        <MapPin size={12} className="text-electric-cyan" /> {dest.country}
                      </p>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-xs text-white/60 line-clamp-2 mb-3 leading-relaxed">
                      {dest.description || 'Iconic travel destination.'}
                    </p>

                    {dest.estimatedBudgetPerDay && (
                      <span className="text-xs font-bold text-amber block">
                        ~{dest.currency} {dest.estimatedBudgetPerDay} / day
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link to={`/dashboard/planner?destination=${encodeURIComponent(dest.name)}&state=${encodeURIComponent(dest.city || dest.country || '')}`}>
                    <button className="w-full py-2 bg-white/5 hover:bg-electric-blue text-white/80 hover:text-white border border-white/10 hover:border-electric-blue rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2">
                      Plan Trip to {dest.name}
                      <ArrowRight size={14} />
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card p-12 border border-white/10 text-center">
          <EmptyState
            icon={Heart}
            title="No Saved Destinations Yet"
            description="Explore our world catalog and click the heart icon on any card to save it here."
            action={() => (window.location.href = '/dashboard/explore')}
            actionLabel="Explore Destinations"
          />
        </div>
      )}
    </DashboardLayout>
  );
};

export default Favorites;
