import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Compass, Sparkles, Map, Network, Shield, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-navy-secondary border-t border-white/10 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-electric-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Information */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-tr from-electric-blue via-electric-cyan to-violet rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Plane className="text-white" size={20} />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Travel<span className="text-electric-cyan">Mate</span>
              </span>
            </Link>
            <p className="text-sm text-white/60 max-w-sm mb-6 leading-relaxed">
              Explore More. Plan Smarter. Travel Better.
              An AI-powered travel planning & graph visualization platform designed for the modern explorer.
            </p>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Shield size={14} className="text-emerald-400" />
              <span>Production-grade security & verified open geographic routing</span>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li><Link to="/#features" className="hover:text-white transition-colors">AI Trip Planner</Link></li>
              <li><Link to="/#graph" className="hover:text-white transition-colors">Interactive Travel Graph</Link></li>
              <li><Link to="/#destinations" className="hover:text-white transition-colors">Destination Explorer</Link></li>
              <li><Link to="/#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
            </ul>
          </div>

          {/* Travel Tools */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Trip Dashboard</Link></li>
              <li><Link to="/dashboard/planner" className="hover:text-white transition-colors">Generate Itinerary</Link></li>
              <li><Link to="/dashboard/graph" className="hover:text-white transition-colors">Network Topology</Link></li>
              <li><Link to="/dashboard/maps" className="hover:text-white transition-colors">OSM Route Engine</Link></li>
              <li><Link to="/dashboard/budget" className="hover:text-white transition-colors">Expense Analytics</Link></li>
            </ul>
          </div>

          {/* Legal and Support */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li><span className="text-white/40 cursor-default">Privacy Policy</span></li>
              <li><span className="text-white/40 cursor-default">Terms of Service</span></li>
              <li><span className="text-white/40 cursor-default">API Documentation</span></li>
              <li><span className="text-white/40 cursor-default">Render Deployment</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} TravelMate Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Engineered with modern full-stack web standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
