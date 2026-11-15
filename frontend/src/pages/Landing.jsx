import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Search,
  Sparkles,
  Map,
  Network,
  Wallet,
  Globe,
  Compass,
  ArrowRight,
  Plane,
  Star,
  Zap,
  MapPin,
  Clock,
  Shield,
  Route,
  CheckCircle2,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const AnimatedSection = ({ children, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const POPULAR_DESTINATIONS = [
  {
    name: 'Paris',
    country: 'France',
    desc: 'The City of Light, celebrated for art, haute cuisine, and iconic monuments.',
    budget: '~€150/day',
    emoji: '🗼',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    tags: ['Romantic', 'Culture', 'Gastronomy'],
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    desc: 'An electrifying fusion of neon high-rises and sacred historic Shinto shrines.',
    budget: '~$120/day',
    emoji: '⛩️',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
    tags: ['Tech', 'Temples', 'Culinary'],
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    desc: 'Lush terraced rice paddies, volcanic peaks, sacred temples, and surf breaks.',
    budget: '~$60/day',
    emoji: '🌺',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    tags: ['Wellness', 'Beaches', 'Nature'],
  },
  {
    name: 'New York City',
    country: 'USA',
    desc: 'The global capital of theater, skyline architecture, and boundless energy.',
    budget: '~$200/day',
    emoji: '🗽',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
    tags: ['Metropolis', 'Museums', 'Nightlife'],
  },
  {
    name: 'Santorini',
    country: 'Greece',
    desc: 'Caldera cliffs topped by whitewashed villages and world-famous Aegean sunsets.',
    budget: '~€180/day',
    emoji: '🌊',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    tags: ['Scenic', 'Caldera', 'Sunsets'],
  },
  {
    name: 'Barcelona',
    country: 'Spain',
    desc: 'Antoni Gaudí modernist architecture, Mediterranean beaches, and lively tapas bars.',
    budget: '~€110/day',
    emoji: '🎨',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80',
    tags: ['Architecture', 'Tapas', 'Beaches'],
  },
];

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI Trip Planner',
    desc: 'Generate rich, day-by-day itineraries validated with Gemini AI structured schema.',
    color: 'text-electric-blue',
    bg: 'from-blue-500/20 to-blue-600/5',
  },
  {
    icon: Network,
    title: 'Interactive Travel Graph',
    desc: 'Visualize cities, attractions, and hotels as nodes with Dijkstra and A* pathfinding.',
    color: 'text-violet',
    bg: 'from-violet/20 to-violet/5',
  },
  {
    icon: Map,
    title: 'Smart Real Routes',
    desc: 'Compute real-world distances, travel durations, and geometries via OpenStreetMap & OSRM.',
    color: 'text-electric-cyan',
    bg: 'from-cyan-500/20 to-cyan-500/5',
  },
  {
    icon: Wallet,
    title: 'Budget Analytics',
    desc: 'Monitor estimated versus actual expenses categorized with interactive Recharts visualizers.',
    color: 'text-amber',
    bg: 'from-amber/20 to-amber/5',
  },
  {
    icon: Globe,
    title: 'Destination Explorer',
    desc: 'Discover global destinations with verified coordinates, attractions, and daily budgets.',
    color: 'text-emerald-400',
    bg: 'from-emerald-500/20 to-emerald-500/5',
  },
  {
    icon: Compass,
    title: 'Trip Management',
    desc: 'Duplicate plans, manage notes, mark activities complete, and create shareable public links.',
    color: 'text-pink-400',
    bg: 'from-pink-500/20 to-pink-500/5',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Discover Destinations',
    desc: 'Explore curated global cities, historical landmarks, and natural wonders.',
  },
  {
    num: '02',
    title: 'Personalize Preferences',
    desc: 'Select your budget, travel style, travel companions, and target pace.',
  },
  {
    num: '03',
    title: 'Generate AI Itinerary',
    desc: 'Receive structured morning, afternoon, and evening recommendations.',
  },
  {
    num: '04',
    title: 'Navigate Graphs & Maps',
    desc: 'Simulate routes on interactive network canvases and OpenStreetMap layers.',
  },
];

const GRAPH_DEMO_NODES = [
  { id: 'cdg', label: 'Paris Airport', x: 80, y: 110, color: '#3B82F6', type: 'Airport' },
  { id: 'center', label: 'City Center', x: 220, y: 160, color: '#22D3EE', type: 'City' },
  { id: 'louvre', label: 'Louvre Museum', x: 340, y: 90, color: '#8B5CF6', type: 'Attraction' },
  { id: 'eiffel', label: 'Eiffel Tower', x: 190, y: 280, color: '#F59E0B', type: 'Landmark' },
  { id: 'hotel', label: 'Boutique Hotel', x: 360, y: 240, color: '#10B981', type: 'Hotel' },
];

const GRAPH_DEMO_EDGES = [
  { from: 'cdg', to: 'center', mode: 'RER Train' },
  { from: 'center', to: 'louvre', mode: 'Walk' },
  { from: 'center', to: 'eiffel', mode: 'Metro' },
  { from: 'center', to: 'hotel', mode: 'Walk' },
  { from: 'louvre', to: 'hotel', mode: 'Walk' },
];

const Landing = () => {
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/dashboard/explore?q=${encodeURIComponent(searchVal.trim())}`);
    } else {
      navigate('/dashboard/explore');
    }
  };

  return (
    <div className="min-h-screen bg-navy text-white overflow-x-hidden">
      <Navbar />

      {/* ======================= HERO SECTION ======================= */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
        {/* Cinematic dark ambient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-electric-blue/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-violet/10 rounded-full blur-[140px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-electric-cyan/5 rounded-full blur-[160px]" />
          
          {/* Subtle geometric dot grid */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '36px 36px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center z-10">
          {/* Tagline pill */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs sm:text-sm font-semibold tracking-wide text-electric-cyan mb-8 backdrop-blur-xl"
          >
            <Sparkles size={14} className="text-electric-cyan" />
            <span>Explore More. Plan Smarter. Travel Better.</span>
          </motion.div>

          {/* Master Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.08] mb-8"
          >
            Your Next{' '}
            <span className="bg-gradient-to-r from-electric-blue via-electric-cyan to-violet bg-clip-text text-transparent">
              Adventure
            </span>
            <br />
            Starts Here.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/60 max-w-3xl mx-auto mb-10 leading-relaxed font-normal"
          >
            Plan smarter journeys with AI-powered itineraries, interactive travel graphs,
            real-world routes, and intelligent budget management.
          </motion.p>

          {/* Primary CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link to="/register">
              <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-electric-blue to-electric-cyan text-white text-base font-bold rounded-2xl shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5">
                <Sparkles size={18} />
                Plan My Trip
              </button>
            </Link>
            <Link to="/dashboard/explore">
              <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/15 text-white text-base font-bold rounded-2xl hover:bg-white/10 hover:border-white/25 active:scale-95 transition-all flex items-center justify-center gap-2.5">
                <Globe size={18} />
                Explore Destinations
              </button>
            </Link>
          </motion.div>

          {/* Destination Search input bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto mb-16"
          >
            <div className="flex items-center bg-white/5 border border-white/15 rounded-2xl p-2.5 backdrop-blur-2xl shadow-2xl focus-within:border-electric-blue/60 transition-colors">
              <Search className="text-white/40 ml-3 shrink-0" size={20} />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search destinations (e.g. Paris, Tokyo, Bali, Rome)..."
                className="flex-1 bg-transparent text-white placeholder-white/30 px-4 py-2 outline-none text-sm font-medium"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-electric-blue hover:bg-blue-600 text-white font-semibold text-sm rounded-xl transition-colors shrink-0"
              >
                Search
              </button>
            </div>
          </motion.form>

          {/* Floating travel information cards */}
          <div className="relative hidden lg:block">
            <motion.div
              className="absolute -left-12 -top-6 glass-card p-4 flex items-center gap-3.5 w-60 animate-float shadow-2xl"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="w-11 h-11 bg-electric-blue/20 rounded-xl flex items-center justify-center text-xl shrink-0">
                🗺️
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white uppercase tracking-wider">Top Destinations</p>
                <p className="text-sm font-bold text-electric-cyan">500+ Cities & Sites</p>
              </div>
            </motion.div>

            <motion.div
              className="absolute -right-12 -top-6 glass-card p-4 flex items-center gap-3.5 w-60 animate-float-delayed shadow-2xl"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
            >
              <div className="w-11 h-11 bg-violet/20 rounded-xl flex items-center justify-center text-xl shrink-0">
                🤖
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white uppercase tracking-wider">Gemini AI Model</p>
                <p className="text-sm font-bold text-violet">Structured Schema</p>
              </div>
            </motion.div>

            <motion.div
              className="absolute left-1/2 -translate-x-1/2 -bottom-12 glass-card p-4 flex items-center gap-3.5 w-64 animate-float-slow shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <div className="w-11 h-11 bg-amber/20 rounded-xl flex items-center justify-center text-xl shrink-0">
                ⚡
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white uppercase tracking-wider">Real-world routing</p>
                <p className="text-sm font-bold text-amber">OSRM & OpenStreetMap</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================== POPULAR DESTINATIONS ================== */}
      <section id="destinations" className="py-24 bg-navy-secondary/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-electric-cyan mb-3 block">
                Iconic Escapes
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
                Popular <span className="gradient-text">Destinations</span>
              </h2>
              <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto font-normal">
                Curated destinations featuring rich cultural history, verified daily budget benchmarks, and notable attractions.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {POPULAR_DESTINATIONS.map((dest) => (
                <motion.div
                  key={dest.name}
                  variants={fadeInUp}
                  whileHover={{ y: -6 }}
                  className="glass-card overflow-hidden group cursor-pointer border border-white/10 hover:border-electric-blue/40 transition-all duration-300"
                  onClick={() => navigate('/register')}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
                    <div className="absolute top-4 right-4 px-3 py-1 bg-navy/80 backdrop-blur-md rounded-full text-xs font-bold text-electric-cyan border border-white/10">
                      {dest.budget}
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-2xl font-black text-white flex items-center gap-2">
                        <span>{dest.emoji}</span> {dest.name}
                      </h3>
                      <p className="text-xs text-white/70 flex items-center gap-1 font-medium">
                        <MapPin size={13} className="text-electric-cyan" /> {dest.country}
                      </p>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-sm text-white/60 mb-5 leading-relaxed line-clamp-2">
                      {dest.desc}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {dest.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-white/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button className="w-full py-2.5 bg-white/5 hover:bg-electric-blue text-white/80 hover:text-white border border-white/10 hover:border-electric-blue rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2">
                      Explore Itinerary
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ================== HOW IT WORKS ================== */}
      <section id="how-it-works" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-violet mb-3 block">
                Workflow Process
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
                How It <span className="gradient-text">Works</span>
              </h2>
              <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto">
                A streamlined journey from travel inspiration to an interactive, fully visualized expedition.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {STEPS.map((step, idx) => (
                <motion.div
                  key={step.num}
                  variants={fadeInUp}
                  className="glass-card p-6 relative border border-white/10 hover:border-white/20 transition-all flex flex-col"
                >
                  <div className="text-3xl font-black text-white/20 mb-4">{step.num}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ================== FEATURES SHOWCASE ================== */}
      <section id="features" className="py-24 bg-navy-secondary/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-electric-blue mb-3 block">
                Comprehensive Capabilities
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
                Engineered for <span className="gradient-text">Intelligent Travel</span>
              </h2>
              <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto">
                Everything you need to plan, visualize, and budget your travel seamlessly in one cohesive web application.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {FEATURES.map((feat) => {
                const Icon = feat.icon;
                return (
                  <motion.div
                    key={feat.title}
                    variants={fadeInUp}
                    className="glass-card p-8 border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.bg} flex items-center justify-center mb-6`}
                    >
                      <Icon className={feat.color} size={26} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
                    <p className="text-sm text-white/60 leading-relaxed">{feat.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ================== TRAVEL GRAPH SHOWCASE ================== */}
      <section id="graph" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left narrative */}
              <motion.div variants={fadeInUp}>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet/10 border border-violet/20 rounded-full text-violet text-xs font-bold uppercase tracking-wider mb-4">
                  <Network size={14} />
                  Signature Differentiator
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-6">
                  Interactive <span className="gradient-text">Travel Graph</span>
                </h2>
                <p className="text-base sm:text-lg text-white/70 mb-6 leading-relaxed">
                  Understand your journey as a mathematical and spatial network. TravelMate maps cities, attractions, hotels, and transportation stations as interconnected graph nodes with real road and transit weights.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    'Dijkstra & A* algorithms for optimal weighted route calculation',
                    'Breadth-First and Depth-First network exploration algorithms',
                    'Kruskal Minimum Spanning Tree (MST) for multi-city coverage networks',
                    'Bidirectional synchronization with OpenStreetMap Leaflet layers',
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-electric-cyan shrink-0 mt-0.5" />
                      <span className="text-sm text-white/80 font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>

                <Link to="/register">
                  <button className="px-8 py-3.5 bg-gradient-to-r from-violet to-electric-blue text-white font-bold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 flex items-center gap-2 transition-all">
                    Launch Graph Workspace
                    <ArrowRight size={16} />
                  </button>
                </Link>
              </motion.div>

              {/* Right interactive preview diagram */}
              <motion.div variants={fadeInUp} className="glass-card p-6 border border-white/10">
                <div className="bg-navy rounded-2xl p-6 relative overflow-hidden h-96 border border-white/5 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-white/40 border-b border-white/10 pb-3">
                    <span className="font-mono">GRAPH_TOPOLOGY_PREVIEW</span>
                    <span className="text-electric-cyan font-mono">Dijkstra Shortest Path</span>
                  </div>

                  <svg viewBox="0 0 440 320" className="w-full h-full my-auto">
                    {/* Render Edges */}
                    {GRAPH_DEMO_EDGES.map((edge, idx) => {
                      const fromNode = GRAPH_DEMO_NODES.find((n) => n.id === edge.from);
                      const toNode = GRAPH_DEMO_NODES.find((n) => n.id === edge.to);
                      return (
                        <g key={idx}>
                          <line
                            x1={fromNode.x}
                            y1={fromNode.y}
                            x2={toNode.x}
                            y2={toNode.y}
                            stroke="rgba(59, 130, 246, 0.35)"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                          />
                        </g>
                      );
                    })}

                    {/* Render Highlighted Shortest Path */}
                    <line x1={80} y1={110} x2={220} y2={160} stroke="#22D3EE" strokeWidth="3" />
                    <line x1={220} y1={160} x2={340} y2={90} stroke="#22D3EE" strokeWidth="3" />

                    {/* Render Nodes */}
                    {GRAPH_DEMO_NODES.map((node) => (
                      <g key={node.id} className="cursor-pointer">
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="18"
                          fill={node.color}
                          fillOpacity="0.2"
                          stroke={node.color}
                          strokeWidth="2"
                        />
                        <circle cx={node.x} cy={node.y} r="7" fill={node.color} />
                        <text
                          x={node.x}
                          y={node.y + 30}
                          textAnchor="middle"
                          fill="rgba(255,255,255,0.9)"
                          fontSize="11"
                          fontWeight="600"
                          fontFamily="Inter, sans-serif"
                        >
                          {node.label}
                        </text>
                      </g>
                    ))}
                  </svg>

                  <div className="flex items-center justify-between text-[11px] text-white/50 pt-2 border-t border-white/10">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-electric-cyan" /> Highlighted Shortest Path
                    </span>
                    <span>5 Nodes · 5 Edges</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ================== VERIFIED STATISTICS ================== */}
      <section className="py-20 bg-navy-secondary/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '10+', label: 'Global Destinations Seeded', icon: Globe, color: 'text-electric-blue' },
                { value: '6', label: 'Graph Algorithms Implemented', icon: Network, color: 'text-violet' },
                { value: '100%', label: 'OSRM Route Geometry Sync', icon: Route, color: 'text-electric-cyan' },
                { value: 'JSON', label: 'Gemini AI Structured Output', icon: Sparkles, color: 'text-amber' },
              ].map((stat, i) => (
                <motion.div key={i} variants={fadeInUp} className="p-6">
                  <div className={`text-4xl sm:text-5xl font-black mb-2 ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-white/60 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ================== TESTIMONIALS ================== */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2 block">
                Traveler Experiences · Illustrative Showcase
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
                What Explorers <span className="gradient-text">Value</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote:
                    'The visual network graph allowed me to see how attractions link together before setting foot in Paris. The shortest path algorithm saved us 2 hours of transit every day.',
                  name: 'Elena Rostova',
                  role: 'Architect & Solo Traveler',
                  rating: 5,
                },
                {
                  quote:
                    'Having our Gemini AI itinerary automatically sync with OpenStreetMap coordinates and expense categories in one view gave us total peace of mind.',
                  name: 'Marcus Chen',
                  role: 'Photographer',
                  rating: 5,
                },
                {
                  quote:
                    'TravelMate replaces 4 disjointed apps. The budget manager showed our estimated vs actual expenses clearly, making group splitting straightforward.',
                  name: 'Sarah Jenkins',
                  role: 'Group Expedition Planner',
                  rating: 5,
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="glass-card p-8 border border-white/10 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex gap-1 text-amber mb-4">
                      {Array.from({ length: item.rating }).map((_, r) => (
                        <Star key={r} size={15} fill="currentColor" />
                      ))}
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed italic mb-6">
                      "{item.quote}"
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-sm font-bold text-white">{item.name}</p>
                    <p className="text-xs text-white/40">{item.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ================== BOTTOM CTA ================== */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="glass-card p-12 sm:p-16 border border-white/15 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/15 via-transparent to-violet/15 pointer-events-none" />
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
                Begin Planning Your Next Journey
              </h2>
              <p className="text-base sm:text-lg text-white/60 max-w-xl mx-auto mb-8">
                Create an account in seconds to generate personalized itineraries, explore network graphs, and monitor your travel budget.
              </p>
              <Link to="/register">
                <button className="px-10 py-4 bg-gradient-to-r from-electric-blue to-electric-cyan text-white text-base font-bold rounded-2xl shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2">
                  <Plane size={18} />
                  Get Started Free
                </button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
