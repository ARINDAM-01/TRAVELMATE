import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Sparkles,
  Calendar,
  Wallet,
  Globe,
  Network,
  ArrowRight,
  Plus,
  Compass,
  Heart,
  TrendingUp,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import api, { extractError } from '../services/api';
import Button from '../components/common/Button';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/trips/dashboard');
      setStats(data.data);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout activeTitle="Dashboard Overview">
      {/* Welcome Hero Banner */}
      <div className="relative glass-card p-6 sm:p-8 border border-white/10 rounded-2xl mb-8 overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 block">
            Traveler Workspace
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
            Welcome back, {user?.name || 'Explorer'}!
          </h2>
          <p className="text-sm text-white/60 mb-6 leading-relaxed">
            Ready for your next expedition? Generate a structured itinerary with Gemini AI, explore spatial travel connections, or track your travel budget in real-time.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/dashboard/planner">
              <Button variant="gradient" size="md" icon={Sparkles}>
                Generate AI Itinerary
              </Button>
            </Link>
            <Link to="/dashboard/trips">
              <Button variant="outline" size="md" icon={Plus}>
                Create New Trip
              </Button>
            </Link>
            <Link to="/dashboard/graph">
              <Button variant="secondary" size="md" icon={Network}>
                View Travel Graph
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-between text-sm text-red-400">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-1.5 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-xs font-semibold text-white transition-colors"
          >
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      )}

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {[
          {
            label: 'Total Trips',
            value: stats ? stats.totalTrips : '-',
            icon: MapPin,
            color: 'text-white',
            bg: 'bg-white/10',
          },
          {
            label: 'Destinations',
            value: stats ? stats.totalDestinations : '-',
            icon: Globe,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
          },
          {
            label: 'Saved Favorites',
            value: stats ? stats.totalFavorites : '-',
            icon: Heart,
            color: 'text-pink-400',
            bg: 'bg-pink-500/10',
          },
          {
            label: 'Total Expenses',
            value: stats ? `₹${Math.round(stats.totalExpenses).toLocaleString('en-IN')}` : '-',
            icon: Wallet,
            color: 'text-amber',
            bg: 'bg-amber/10',
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-5 border border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}>
                  <Icon size={16} />
                </div>
              </div>
              <div className={`text-2xl sm:text-3xl font-black ${stat.color}`}>
                {loading ? <div className="h-8 bg-white/10 rounded w-16 animate-pulse" /> : stat.value}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Grid: Recent Trips + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Trips Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin size={18} className="text-electric-cyan" />
              Recent Trips
            </h3>
            <Link to="/dashboard/trips" className="text-xs font-bold text-electric-cyan hover:underline flex items-center gap-1">
              View All <ArrowRight size={13} />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : stats?.recentTrips?.length > 0 ? (
            <div className="space-y-4">
              {stats.recentTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="glass-card p-5 border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-base">{trip.title}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/10 text-white/70">
                        {trip.status}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 flex items-center gap-1">
                      <MapPin size={12} className="text-electric-blue" />
                      {Array.isArray(trip.destinations) && trip.destinations.length > 0
                        ? trip.destinations.join(' → ')
                        : trip.startLocation}
                    </p>
                    {trip.startDate && (
                      <p className="text-xs text-white/40 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(trip.startDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Link to={`/dashboard/trips?id=${trip.id}`}>
                      <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-white transition-all">
                        Details
                      </button>
                    </Link>
                    <Link to={`/dashboard/graph?tripId=${trip.id}`}>
                      <button className="px-4 py-2 bg-violet/20 hover:bg-violet/30 border border-violet/30 rounded-xl text-xs font-semibold text-violet transition-all flex items-center gap-1.5">
                        <Network size={13} />
                        Graph
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 border border-white/10 text-center">
              <EmptyState
                icon={Compass}
                title="No Trips Created Yet"
                description="Start your travel journey by creating your first expedition or letting our AI build a customized plan."
                action={() => (window.location.href = '/dashboard/planner')}
                actionLabel="Generate AI Itinerary"
              />
            </div>
          )}
        </div>

        {/* Quick Launch & Upcoming Expeditions */}
        <div className="space-y-6">
          <div className="glass-card p-6 border border-white/10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/70 mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-electric-cyan" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link to="/dashboard/planner" className="block">
                <div className="p-3.5 bg-gradient-to-r from-electric-blue/15 to-violet/15 hover:from-electric-blue/25 hover:to-violet/25 border border-electric-blue/20 rounded-xl transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-white flex items-center gap-2">
                      <Sparkles size={15} className="text-electric-cyan" /> AI Trip Planner
                    </span>
                    <ArrowRight size={14} className="text-electric-cyan" />
                  </div>
                  <p className="text-xs text-white/50">Generate personalized itineraries instantly</p>
                </div>
              </Link>

              <Link to="/dashboard/explore" className="block">
                <div className="p-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-white flex items-center gap-2">
                      <Globe size={15} className="text-emerald-400" /> Explore Destinations
                    </span>
                    <ArrowRight size={14} className="text-white/40" />
                  </div>
                  <p className="text-xs text-white/50">Browse global cities, landmarks & budgets</p>
                </div>
              </Link>

              <Link to="/dashboard/graph" className="block">
                <div className="p-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-white flex items-center gap-2">
                      <Network size={15} className="text-violet" /> Travel Graph Canvas
                    </span>
                    <ArrowRight size={14} className="text-white/40" />
                  </div>
                  <p className="text-xs text-white/50">Explore shortest paths & network topology</p>
                </div>
              </Link>

              <Link to="/dashboard/budget" className="block">
                <div className="p-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-white flex items-center gap-2">
                      <Wallet size={15} className="text-amber" /> Budget Analytics
                    </span>
                    <ArrowRight size={14} className="text-white/40" />
                  </div>
                  <p className="text-xs text-white/50">Track expenses with interactive charts</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
