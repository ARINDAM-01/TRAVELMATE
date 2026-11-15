import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plane, Calendar, MapPin, Network, Clock, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import api, { extractError } from '../services/api';
import Spinner from '../components/common/Spinner';

const SharedTrip = () => {
  const { token } = useParams();
  const [trip, setTrip] = useState(null);
  const [shareInfo, setShareInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedTrip = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/shared/${token}`);
        setTrip(data.data.trip);
        setShareInfo(data.data.shareInfo);
      } catch (err) {
        setError(extractError(err));
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchSharedTrip();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy text-white flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-navy text-white flex items-center justify-center p-4">
        <div className="glass-card p-8 border border-white/10 text-center max-w-md">
          <AlertCircle size={40} className="text-red-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">Shared Trip Unavailable</h2>
          <p className="text-sm text-white/50 mb-6">{error || 'This link may have expired or is private.'}</p>
          <Link to="/">
            <button className="px-5 py-2.5 bg-electric-blue text-white font-semibold rounded-xl text-sm">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy text-white">
      {/* Top Header */}
      <header className="h-20 bg-navy-secondary/80 backdrop-blur-xl border-b border-white/10 px-6 sm:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-electric-blue via-electric-cyan to-violet rounded-xl flex items-center justify-center">
            <Plane className="text-white" size={20} />
          </div>
          <span className="text-xl font-black text-white">
            Travel<span className="text-electric-cyan">Mate</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
          <ShieldCheck size={14} /> Shared Itinerary View
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-6 sm:p-8 space-y-8">
        <div className="glass-card p-8 border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-electric-cyan">
                Curated Itinerary
              </span>
              <h1 className="text-3xl font-black text-white mt-1">{trip.title}</h1>
              <p className="text-xs text-white/40 mt-1">Shared by {trip.user?.name || 'Explorer'}</p>
            </div>
            {trip.budget && (
              <div className="text-left sm:text-right">
                <span className="text-xs text-white/40 block">Estimated Budget</span>
                <span className="text-xl font-black text-amber">
                  {trip.currency} {trip.budget}
                </span>
              </div>
            )}
          </div>

          <p className="text-sm text-white/70 leading-relaxed font-normal">
            {trip.description || 'A structured travel journey created on TravelMate.'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs">
            <div>
              <span className="text-white/40 block">Origin</span>
              <span className="font-semibold text-white">{trip.startLocation}</span>
            </div>
            <div>
              <span className="text-white/40 block">Destinations</span>
              <span className="font-semibold text-white">
                {Array.isArray(trip.destinations) ? trip.destinations.join(', ') : '-'}
              </span>
            </div>
            <div>
              <span className="text-white/40 block">Travelers</span>
              <span className="font-semibold text-white">{trip.numTravelers}</span>
            </div>
            <div>
              <span className="text-white/40 block">Total Days</span>
              <span className="font-semibold text-electric-cyan">{trip.itineraryDays?.length || 0} Days</span>
            </div>
          </div>
        </div>

        {/* Days & Schedule */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar size={18} className="text-electric-cyan" />
            Scheduled Days
          </h2>

          {trip.itineraryDays?.map((day) => (
            <div key={day.id} className="glass-card p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-electric-blue/20 text-electric-cyan flex items-center justify-center font-bold text-sm">
                    {day.dayNumber}
                  </span>
                  <div>
                    <h3 className="font-bold text-white text-base">
                      Day {day.dayNumber}: {day.location}
                    </h3>
                    {day.summary && <p className="text-xs text-white/50">{day.summary}</p>}
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 pl-4 border-l border-white/10">
                {day.activities?.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-start justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-sm">{act.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/10 text-white/60">
                          {act.timeOfDay}
                        </span>
                      </div>
                      <p className="text-white/70 leading-relaxed">{act.description}</p>
                    </div>
                    {act.estimatedCost > 0 && (
                      <span className="font-semibold text-amber shrink-0">
                        ~{act.currency} {act.estimatedCost}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center py-8">
          <Link to="/register">
            <button className="px-8 py-3.5 bg-gradient-to-r from-electric-blue to-electric-cyan text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25 inline-flex items-center gap-2">
              Plan Your Own Trip on TravelMate <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default SharedTrip;
