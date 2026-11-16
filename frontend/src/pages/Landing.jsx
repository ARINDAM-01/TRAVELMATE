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
import HeroVideoBackground from '../components/layout/HeroVideoBackground';
import TravelMateItineraryWindow from '../components/cards/TravelMateItineraryWindow';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const AnimatedSection = ({ children, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' });
  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={`transform-gpu ${className}`}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </motion.div>
  );
};

const POPULAR_DESTINATIONS = [
  {
    name: 'Jaipur',
    country: 'India',
    desc: 'The Pink City of Rajasthan, celebrated for hilltop forts, royal palaces, and bazaars.',
    budget: '~₹2,800/day',
    emoji: '👑',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    tags: ['Royal', 'Heritage', 'Culture'],
  },
  {
    name: 'Alleppey',
    country: 'India',
    desc: 'Serene backwaters, palm-fringed lagoons, and traditional houseboat cruises in God\'s Own Country.',
    budget: '~₹3,500/day',
    emoji: '🛶',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    tags: ['Backwaters', 'Houseboat', 'Ayurveda'],
  },
  {
    name: 'North Goa',
    country: 'India',
    desc: 'Sun-drenched golden beaches, Portuguese forts, coastal shacks, and vibrant nightlife.',
    budget: '~₹2,800/day',
    emoji: '🏖️',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    tags: ['Beaches', 'Water Sports', 'Nightlife'],
  },
  {
    name: 'Manali',
    country: 'India',
    desc: 'High Himalayan valleys, snow-capped passes, apple orchards, and thrilling adventure trails.',
    budget: '~₹2,600/day',
    emoji: '🏔️',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    tags: ['Mountains', 'Snow', 'Trekking'],
  },
  {
    name: 'Varanasi',
    country: 'India',
    desc: 'Timeless spiritual ghats on River Ganga, evening Ganga Aarti, and sacred temple heritage.',
    budget: '~₹1,800/day',
    emoji: '🛕',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
    tags: ['Spiritual', 'Ghats', 'Culture'],
  },
  {
    name: 'Leh & Ladakh',
    country: 'India',
    desc: 'Crystal-clear Pangong Tso, Khardung La pass, ancient Buddhist gompas, and high desert beauty.',
    budget: '~₹3,800/day',
    emoji: '✨',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
    tags: ['Monasteries', 'Pangong', 'Himalayas'],
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
  { id: 'del', label: 'Delhi / Jaipur Airport', x: 80, y: 110, color: '#3B82F6', type: 'Airport' },
  { id: 'center', label: 'Old City Center', x: 220, y: 160, color: '#22D3EE', type: 'City' },
  { id: 'hawa', label: 'Hawa Mahal & City Palace', x: 340, y: 90, color: '#8B5CF6', type: 'Attraction' },
  { id: 'amer', label: 'Amer Hilltop Fort', x: 190, y: 280, color: '#F59E0B', type: 'Landmark' },
  { id: 'hotel', label: 'Heritage Haveli Hotel', x: 360, y: 240, color: '#10B981', type: 'Hotel' },
];

const GRAPH_DEMO_EDGES = [
  { from: 'del', to: 'center', mode: 'Express Cab' },
  { from: 'center', to: 'hawa', mode: 'E-Rickshaw' },
  { from: 'center', to: 'amer', mode: 'Scenic Drive' },
  { from: 'center', to: 'hotel', mode: 'Walk' },
  { from: 'hawa', to: 'hotel', mode: 'Walk' },
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
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Crystal Clear Background Video (No Dimming) */}
        <HeroVideoBackground />

        {/* Hero Floating Showcase Card (Clean, Sharp Translucency - No Blur) */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10 w-full flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full rounded-3xl bg-[#0B0D13]/70 border border-white/15 p-8 sm:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.7)] flex flex-col items-center text-center"
          >
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/15 rounded-full text-[11px] font-semibold tracking-widest uppercase text-neutral-200 mb-6 shadow-sm"
            >
              <Compass size={13} className="text-amber-400" />
              <span>Expedition Architecture • Spatial Routing</span>
            </motion.div>

            {/* Editorial Master Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-6 text-white max-w-3xl drop-shadow-sm"
            >
              Journeys, Curated.
              <br />
              <span className="text-neutral-300 font-light">Exploration Without Friction.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-neutral-200/90 max-w-xl mx-auto mb-8 leading-relaxed font-normal"
            >
              Plan smarter expeditions with structured day-by-day itineraries, spatial routing graphs,
              and precision travel analytics.
            </motion.p>

            {/* Clean Destination Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              onSubmit={handleSearchSubmit}
              className="w-full max-w-md mx-auto mb-8"
            >
              <div className="flex items-center bg-black/60 border border-white/20 rounded-2xl p-1.5 shadow-xl focus-within:border-white/40 transition-all">
                <Search className="text-neutral-300 ml-3 shrink-0" size={17} />
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Search Indian destinations (e.g. Jaipur, Munnar, Goa, Manali)..."
                  className="flex-1 bg-transparent text-white placeholder-neutral-400 px-3 py-2 outline-none text-xs sm:text-sm font-medium"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-xs sm:text-sm rounded-xl transition-all shrink-0 shadow-md active:scale-95"
                >
                  Explore
                </button>
              </div>
            </motion.form>

            {/* Primary Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3.5"
            >
              <Link to="/register">
                <button className="w-full sm:w-auto px-7 py-3 bg-white hover:bg-neutral-100 text-neutral-950 text-xs sm:text-sm font-bold rounded-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                  <span>Start Planning</span>
                  <ArrowRight size={15} />
                </button>
              </Link>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('itinerary-workspace');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-7 py-3 bg-white/10 border border-white/20 text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-white/20 hover:border-white/30 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>View Itinerary Engine</span>
                <Compass size={15} className="text-amber-400" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= ITINERARY WORKSPACE SHOWCASE ================= */}
      <section id="itinerary-workspace" className="py-20 relative bg-[#0B0D13] border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2.5 block">
                The Workspace
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-3">
                Interactive <span className="gradient-text">Itinerary Engine</span>
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto font-normal">
                Coordinate daily highlights, real GPS vector routes, and verified attractions in one synchronized canvas.
              </p>
            </motion.div>

            {/* TravelMate Mac OS Glass Window */}
            <motion.div variants={fadeInUp} className="relative w-full z-10">
              <TravelMateItineraryWindow />
            </motion.div>
          </AnimatedSection>
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
                    'The visual network graph allowed me to see how attractions link together before setting foot in Jaipur and Rajasthan. The shortest path algorithm saved us 2 hours of transit every day.',
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
